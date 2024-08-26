import React from "react";
import "../styles/Task.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
  getMarks,
  getTask,
  createMark,
  deleteMark,
  deleteTask,
  getProject,
} from "../API/functions";

const Task = () => {
  const [marks, setMarks] = useState([]);
  const [user, setUser] = useState(null);
  const [task, setTask] = useState(null);
  const [project, setProject] = useState(null);
  const [markCreated, setMarkCreated] = useState(false);
  const [markDeleted, setMarkDeleted] = useState(false);

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("user"));
    setUser(user);
    getMarks(user, id, task_id, setMarks);
    getTask(user, id, task_id, setTask);
    getProject(user, id, setProject);
    console.log(marks);
    console.log(task);
    console.log(project);
  }, [, markCreated, markDeleted]);

  const navigate = useNavigate();
  const { id, task_id } = useParams();

  // Muuttaa paivamaaran formaattia
  const formatDate = (date) => {
    const [year, month, day] = date.split("-");
    return `${day}.${month}.${year}`;
  };

  // Muuttaa luontilomakkeen paivamaaran taksi paivaksi
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleMarkCreation = (e) => {
    e.preventDefault();
    const amount = e.target.amount.value;
    const date = e.target.date.value;
    createMark(user, id, task_id, amount, date, setMarkCreated, markCreated);
  };

  const handleMarkDeletion = (mark_id) => {
    console.log(id, task_id);
    console.log(mark_id);
    deleteMark(user, id, task_id, mark_id, setMarkDeleted, markDeleted);
  };

  const handleTaskDeletion = () => {
    deleteTask(user, id, task_id);
    navigate(-1);
  };

  // Tehtyjen merkintojen maara

  const marksCount = marks.length;

  // Tehtavaan tehdyt tunnit

  const taskHours = marks.reduce((acc, mark) => {
    return acc + mark.attributes.h_amount;
  }, 0);

  if (!task || !project) {
    return <div>Ladataan...</div>;
  }

  return (
    <div className="container">
      <nav>
        <button onClick={() => navigate(-1)}>Takaisin</button>
      </nav>
      <h2>{task.attributes.name}</h2>
      <hr />
      <div className="userStats">
        {user?.role !== "admin" &&
          (project.status === "archived" ||
            task.attributes.status === "archived") && (
            <div className="userStat error">
              <p>Projekti tai tehtävä on päättynyt. Et voi tehdä muutoksia!</p>
            </div>
          )}

        <div className="userStat">
          <p>Tehdyt merkinnät:</p>
          <p>{marksCount}</p>
        </div>
        <div className="userStat">
          <p>Tunnit yhteensä:</p>
          <p>{taskHours}</p>
        </div>
      </div>
      <hr />
      <form onSubmit={handleMarkCreation} className="markForm">
        <div className="addMark">
          <h2>Lisää merkintä</h2>
          <hr />
          <label htmlFor="amount">Määrä</label>
          <div className="inputContainer">
            <input type="number" id="amount" required />
          </div>
          <label htmlFor="date">Päivämäärä</label>
          <div className="inputContainer">
            <input
              type="date"
              id="date"
              defaultValue={getCurrentDate()}
              required
            />
          </div>
          <div className="buttonContainer">
            <button
              type="submit"
              disabled={
                user?.role !== "admin" &&
                (task.attributes.status === "archived" ||
                  project.status === "archived")
              }
            >
              Lisää merkintä
            </button>
          </div>
        </div>
      </form>
      <hr />
      {user?.role === "admin" && (
        <div className="tools">
          <button onClick={handleTaskDeletion}>Poista tehtävä</button>
        </div>
      )}
      <div className="infoTable">
        <div className="viewSelector">Merkinnät</div>
        <table>
          <thead>
            <tr>
              <th>Merkitsijä</th>
              <th>Määrä</th>
              <th>Päivämäärä</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {marks.map((mark) => {
              return (
                <tr key={mark.attributes.id}>
                  <td>{mark.attributes.user_name}</td>
                  <td>{mark.attributes.h_amount}</td>
                  <td>{formatDate(mark.attributes.date)}</td>
                  <td>
                    <button
                      onClick={() => handleMarkDeletion(mark.attributes.id)}
                      disabled={
                        (user.user_id !== mark.attributes.user_id &&
                          user.role !== "admin") ||
                        task.attributes.status === "archived" ||
                        project.status === "archived"
                      }
                    >
                      Poista
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Task;
