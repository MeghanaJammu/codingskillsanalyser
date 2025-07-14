# import pandas as pd
# import json
# import ast
from fastapi import APIRouter, UploadFile, Depends, Query
from sqlalchemy.orm import Session
from ..internals import database
from ..apirepository import questions
from typing import List, Optional

router = APIRouter(tags=["Questions"])


def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


# def parse_column(value, field_name, row_id):
#     if pd.isna(value) or not str(value).strip():
#         return []
#     try:
#         cleaned_value = str(value).replace("_x000D_", "").strip()
#         return json.loads(cleaned_value)
#     except json.JSONDecodeError:
#         try:
#             return ast.literal_eval(cleaned_value)
#         except Exception as e:
#             raise HTTPException(
#                 status_code=400,
#                 detail=f"Invalid data in field '{field_name}' for row ID {row_id}: {e}",
#             )


@router.post("/upload-questions")
async def upload_questions(file: UploadFile, db: Session = Depends(get_db)):
    return questions.upload(file, db)
    # if not file.filename.endswith((".xlsx", ".xls")):
    #     raise HTTPException(status_code=400, detail="Only Excel files are supported")

    # try:
    #     df = pd.read_excel(file.file)
    # except Exception as e:
    #     raise HTTPException(status_code=500, detail=f"Failed to read Excel file: {str(e)}")

    # for _, row in df.iterrows():
    #     try:
    #         question = models.Question(
    #             id=row["id"],
    #             title=row["title"],
    #             description=row["description"],
    #             difficulty=row["difficulty"],
    #             topics=parse_column(row["topics"], "topics", row["id"]),
    #             input_format=row["input_format"],
    #             output_format=row["output_format"],
    #             examples=parse_column(row["examples"], "examples", row["id"]),
    #             hidden_cases=parse_column(row["hidden_cases"], "hidden_cases", row["id"]),
    #             constraints=row["constraints"]
    #         )
    #         db.add(question)

    #     except HTTPException as http_ex:
    #         raise http_ex
    #     except Exception as e:
    #         raise HTTPException(
    #             status_code=500,
    #             detail=f"Error processing row with ID {row['id']}: {str(e)}"
    #         )

    # db.commit()
    # return {"status": "Questions uploaded successfully"}




@router.get("/get-questions")
async def get_questions(topics: Optional[List[str]] = Query(None),
    easy_count: int = 0,
    medium_count: int = 0,
    hard_count: int = 0,
    db: Session = Depends(get_db)):
    return questions.get(topics,easy_count, medium_count, hard_count, db)
    # try:
    #     questions = db.query(models.Question).all()
    #     return [
    #         {
    #             "id": q.id,
    #             "title": q.title,
    #             "description": q.description,
    #             "difficulty": q.difficulty,
    #             "topics": q.topics,
    #             "input_format": q.input_format,
    #             "output_format": q.output_format,
    #             "examples": q.examples,
    #             "hidden_cases": q.hidden_cases,
    #             "constraints": q.constraints,
    #         }
    #         for q in questions
    #     ]
    # except Exception as e:
    #     raise HTTPException(status_code=500, detail=f"Failed to fetch questions: {str(e)}")


