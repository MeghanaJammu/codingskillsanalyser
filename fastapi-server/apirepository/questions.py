from fastapi import HTTPException
from ..internals import models
from sqlalchemy.orm import Session
from sqlalchemy import or_
import pandas as pd
import json
import ast


def parse_column(value, field_name, row_id):
    if pd.isna(value) or not str(value).strip():
        return []
    try:
        cleaned_value = str(value).replace("_x000D_", "").strip()
        return json.loads(cleaned_value)
    except json.JSONDecodeError:
        try:
            return ast.literal_eval(cleaned_value)
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid data in field '{field_name}' for row ID {row_id}: {e}",
            )



def upload(file, db:Session):
    if not file.filename.endswith((".xlsx", ".xls")):
        raise HTTPException(status_code=400, detail="Only Excel files are supported")

    try:
        df = pd.read_excel(file.file)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read Excel file: {str(e)}")

    for _, row in df.iterrows():
        try:
            question = models.Question(
                id=row["id"],
                title=row["title"],
                description=str(row["description"]).replace("_x000D_", "").strip(),  
                difficulty=row["difficulty"],
                topics=parse_column(row["topics"], "topics", row["id"]),
                input_format=str(row["input_format"]).replace("_x000D_", "").strip(),  
                output_format=str(row["output_format"]).replace("_x000D_", "").strip(), 
                examples=parse_column(row["examples"], "examples", row["id"]),
                hidden_cases=parse_column(row["hidden_cases"], "hidden_cases", row["id"]),
                constraints=str(row["constraints"]).replace("_x000D_", "").strip() 
            )
            db.add(question)


        except HTTPException as http_ex:
            raise http_ex
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error processing row with ID {row['id']}: {str(e)}"
            )

    db.commit()
    return {"status": "Questions uploaded successfully"}


def get(topics, easy_count, medium_count, hard_count, db: Session):
    result = []

    def get_questions_for_difficulty(diff: str, count: int):
        if count == 0:
            return []

        query = db.query(models.Question).filter(models.Question.difficulty == diff)

        if topics:
            topic_filters = [models.Question.topics.like(f'%"{t}"%') for t in topics]
            query = query.filter(or_(*topic_filters))

        return query.limit(count).all()

    result += get_questions_for_difficulty("Easy", easy_count)
    result += get_questions_for_difficulty("Medium", medium_count)
    result += get_questions_for_difficulty("Hard", hard_count)

    return result



def get_one(id: int, db: Session):
    question = db.query(models.Question).filter(models.Question.id == id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    return question


def update_question(id: int, updated_data: dict, db: Session):
    question = db.query(models.Question).filter(models.Question.id == id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    # Update only provided fields
    for key, value in updated_data.items():
        if hasattr(question, key):
            if isinstance(value, str):
                cleaned_value = value.replace("_x000D_", "").strip()
                setattr(question, key, cleaned_value)
            else:
                setattr(question, key, value)

    db.commit()
    db.refresh(question)
    return question

