import React from "react";
import "../styles/Project.css";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProject, getTasks } from "../API/functions";
import { createTask, editTask, deleteProject, createMark } from "../API/functions";
import { useNavigate } from "react-router-dom";

const Project = () => {
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState([]);
  const [taskStatus, setTaskStatus] = useState("active");
  const [sort, setSort] = useState("asc");

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [taskCreated, setTaskCreated] = useState(false);
  const [taskEdited, setTaskEdited] = useState(false);
  const [markCreated, setMarkCreated] = useState(false);

  const [selectedTask, setSelectedTask] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    getProject(JSON.parse(localStorage.getItem("user")), id, setProject);
    getTasks(JSON.parse(localStorage.getItem("user")), id, setTasks);
  }, [, id, taskCreated, taskEdited, markCreated]);

  // Aukaisee tai sulkee tehtavaluonti ikkunan
  const handleCreateModal = () => {
    setIsCreateModalOpen(!isCreateModalOpen);
  };

  // Aukaisee tai sulkee tehtavanmuokkaus ikkunan
  const handleEditModal = () => {
    setIsEditModalOpen(!isEditModalOpen);
  };

  // Luo uuden tehtavan
  const handleTaskCreation = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const start_date = e.target.start_date.value;
    createTask(user, id, name, start_date, setTaskCreated, taskCreated);
    handleCreateModal();
  };

  // Muuttaa tehtavan tietoja
  const handleTaskUpdate = (e) => {
    e.preventDefault();
    const name = e.target.update_name.value;
    const start_date = e.target.update_start_date.value;
    const status = e.target.status.value;
    editTask(
      user,
      selectedTask,
      id,
      name,
      start_date,
      status,
      setTaskEdited,
      taskEdited
    );
    setSelectedTask(null);
    handleEditModal();
    setSelectedTask(null);
  };

  // Valitsee tehtavan muokkausta varten
  const handleTaskSelection = (e) => {
    const taskId = e.target.value;
    const task = tasks.find((task) => task.attributes.id == taskId);
    setSelectedTask(task);
    console.log(task);
  };

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

  // Poistaa projektin
  const handleProjectDeletion = () => {
    deleteProject(user, id);
    navigate(-1);
  };

  // Luo merkinnan
  const handleMarkCreation = (e) => {
    e.preventDefault();
    const taskId = e.target.name.value;
    const amount = e.target.amount.value;
    const date = e.target.date.value;
    createMark(user,id, taskId, amount, date, setMarkCreated, markCreated);
  };

  const filteredTasks = tasks.filter(
    (task) => task.attributes.status === taskStatus
  );

  // Jarjestaa listan paivamaaran mukaan
  const sortByDate = () => {
    if (sort === "asc") {
      setSort("desc");
      setTasks(
        tasks.sort((a, b) =>
          a.attributes.start_date > b.attributes.start_date ? 1 : -1
        )
      );
    } else {
      setSort("asc");
      setTasks(
        tasks.sort((a, b) =>
          a.attributes.start_date < b.attributes.start_date ? 1 : -1
        )
      );
    }
  };

  // Tehtavien tehtyjen merkintojen maara
  const marksCount = tasks.reduce((acc, task) => {
    return acc + task.attributes.marks_count;
  }, 0);

  // Tehtaviin tehtyjen tuntien maara
  const totalHours = tasks.reduce((acc, task) => {
    return acc + task.attributes.total_hours;
  }, 0);

  

  return (
    <div className="container">
      <nav>
        <button onClick={() => navigate(-1)}>Takaisin</button>
      </nav>
      <h2>{project.name}</h2>
      <hr />
      <div className="userStats">
        {user?.role !== "admin" && project?.status === "archived" && (
          <div className="userStat error">
            <p>Projekti on päättynyt et voi tehdä lisäyksiä!</p>
          </div>
        )}
        <div className="userStat">
          <p>Tehdyt merkinnät:</p>
          <p>{marksCount}</p>
        </div>
        <div className="userStat">
          <p>Tunnit yhteensä:</p>
          <p>{totalHours}</p>
        </div>
      </div>
      <hr />
      <form onSubmit={handleMarkCreation} className="markForm">
        <div className="addMark">
          <h2>Lisää merkintä</h2>
          <hr />
          <label htmlFor="name">Tehtävä</label>
          <div className="inputContainer">
            <select id="name" required>
              <option value="">Valitse tehtävä</option>
              {tasks.filter(task => task.attributes.status === 'active').map((task) => (
                <option key={task.attributes.id} value={task.attributes.id}>
                  {task.attributes.name}
                </option>
              ))}
            </select>
          </div>
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
            <button type="submit" disabled={user.role !== "admin" && project.status === "archived"}>Lisää merkintä</button>
          </div>
        </div>
      </form>
      <hr />
      {user?.role === "admin" && (
        <div className="tools">
          <button onClick={handleCreateModal}>Luo tehtävä</button>
          {isCreateModalOpen && (
            <>
              <div className="modalBG" onClick={handleCreateModal}></div>
              <div className="modal">
                <form onSubmit={handleTaskCreation}>
                  <h2>Luo uusi tehtävä</h2>

                  <label htmlFor="name">Nimi</label>
                  <div className="inputContainer">
                    <input type="text" id="name" required />
                  </div>

                  <label htmlFor="start_date">Aloitus pvm</label>
                  <div className="inputContainer">
                    <input
                      type="date"
                      id="start_date"
                      defaultValue={getCurrentDate()}
                      required
                    />
                  </div>
                  <div>
                    <button type="submit">Luo</button>
                    <button type="button" onClick={handleCreateModal}>
                      Peruuta
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
          <button onClick={handleEditModal}>Muokkaa tehtävää</button>
          {isEditModalOpen && (
            <>
              <div className="modalBG" onClick={handleEditModal}></div>
              <div className="modal">
                <form onSubmit={handleTaskUpdate}>
                  <h2>Muokkaa tehtävää</h2>

                  <label htmlFor="task_select">Valitse tehtävä</label>
                  <div className="inputContainer">
                    <select
                      id="task_select"
                      onChange={handleTaskSelection}
                      required
                    >
                      <option value="">Valitse tehtävä</option>
                      {tasks.map((task) => (
                        <option
                          key={task.attributes.id}
                          value={task.attributes.id}
                        >
                          {task.attributes.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedTask && (
                    <>
                      <label htmlFor="update_name">Nimi</label>
                      <div className="inputContainer">
                        <input
                          type="text"
                          id="update_name"
                          defaultValue={selectedTask.attributes.name}
                          required
                        />
                      </div>

                      <label htmlFor="update_start_date">Aloitus pvm</label>
                      <div className="inputContainer">
                        <input
                          type="date"
                          id="update_start_date"
                          defaultValue={selectedTask.attributes.start_date}
                          required
                        />
                      </div>

                      <label htmlFor="status">Tila</label>
                      <div className="inputContainer">
                        <select
                          id="status"
                          defaultValue={selectedTask.attributes.status}
                        >
                          <option value="active">Aktiivinen</option>
                          <option value="archived">Päättynyt</option>
                        </select>
                      </div>
                    </>
                  )}
                  <div>
                    <button type="submit">Tallenna</button>
                    <button type="button" onClick={handleEditModal}>
                      Peruuta
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
          <button onClick={handleProjectDeletion}>Poista projekti</button>
        </div>
      )}
      <div className="infoTable">
        <div className="viewSelector">Tehtävät</div>
        <table>
          <thead>
            <tr>
              <th>Nimi</th>
              <th>Merkinnät</th>
              <th>Tunnit</th>
              <th onClick={sortByDate} style={{cursor:"pointer"}}>Aloitus pvm</th>
              <th>
                <select onChange={(e) => setTaskStatus(e.target.value)}>
                  <option value="active">Aktiivinen</option>
                  <option value="archived">Päättynyt</option>
                </select>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.attributes.id}>
                <td>{task.attributes.name}</td>
                <td>{task.attributes.marks_count}</td>
                <td>{task.attributes.total_hours}</td>
                <td>{formatDate(task.attributes.start_date)}</td>
                <td>
                  <Link to={`/projekti/${id}/tehtava/${task.attributes.id}`}>
                    Tehtävään
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Project;
