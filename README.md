# CodeSmart

A full-stack web application that enables **real-time code execution** and provides **AI-driven feedback** on time and space complexity.  
Built for **students, competitive programmers, and developers** who want instant execution, contest-style practice, and intelligent code analysis.  



## Demo  
- [demoLink1](https://drive.google.com/file/d/1z7mwvxttnTc4xkawK1POqBeBmuPhct9T/view?usp=sharing)  
- [demoLink2](https://drive.google.com/file/d/1zhXC3JljWWTkZ_oW4Sas3wwWWfN8pTe6/view?usp=sharing)  



## Features  
- Real-time **code execution** via **Piston API**.
- **Contest-style timers** and **resizable editor panels** for an interactive workspace.
- AI-powered **time/space complexity analysis** using a fine-tuned **CodeT5 model** deployed on Hugging Face.
- Integrated with **Google Gemini GenAI API** for detailed code improvement suggestions.
- **Database-backed question management** and **user authentication** with scalable backend design. 



## Tech Stack


- **Frontend:** React (Vite)  
- **Backend:** FastAPI, SQLAlchemy  
- **AI Models:** Fine-tuned CodeT5 (Hugging Face), Google Gemini GenAI  
- **Execution Engine:** Piston API  
- **Database:** PostgreSQL / SQLite



## ML & AI Contributions


- Processed and cleaned dataset of **~5000 coding questions**  
- Built and evaluated baseline models (**Logistic Regression, MLP**) achieving **63% accuracy**  
- Improved performance to **81.8%** using **CodeT5 fine-tuning** for complexity analysis  
- Published the fine-tuned model on **Hugging Face** for global access  



## Used By


- Students preparing for coding interviews  
- Competitive programmers practicing under timed conditions  
- Developers exploring AI-assisted coding feedback  



## FAQ


**Q: How does CodeSmart analyze time & space complexity?**  
A: Code is passed to a fine-tuned CodeT5 model on Hugging Face, enhanced with Gemini GenAI for detailed feedback.  

**Q: What languages are supported?**  
A: All languages supported by **Piston API** (C++, Python, Java, JavaScript, etc.).  



## Authors


- [@SomrimaSaha](https://github.com/somrima-09)  
- [@MeghanaJammu](https://github.com/MeghanaJammu)  
