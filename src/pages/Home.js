import React from "react";
import "../styles/Home.css";
import "../styles/Modal.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getProjects, createProject, editProject } from "../API/functions";
import Logout from "../components/Logout";

const Home = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [selectedProject, setSelectedProject] = useState(null);
  const [sort, setSort] = useState("asc");

  const [projectCreated, setProjectCreated] = useState(false);
  const [projectStatus, setProjectStatus] = useState("active");
  const navigate = useNavigate();

  // Hakee kaikki projektit ja asettaa ne projects-muuttujaan

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("user"));
    setUser(user);
    getProjects(user, setProjects);
  }, [, projectCreated]);


  // Muuttaa paivamaaran formaattia
  const formatDate = (date) => {
    const [year, month, day] = date.split("-");
    return `${day}.${month}.${year}`;
  };

  // Aukaisee tai sulkee projektiluonti ikkunan
  const handleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleEditModal = () => {
    setIsEditModalOpen(!isEditModalOpen);
  };

  const handleProjectSelection = (e) => {
    const projectId = e.target.value;
    const project = projects.find(
      (project) => project.attributes.id == projectId
    );
    setSelectedProject(project);
    console.log(project);
  };

  const handleProjectUpdate = (e) => {
    e.preventDefault();
    const id = selectedProject.attributes.id;
    const name = e.target.update_name.value;
    const start_date = e.target.update_start_date.value;
    const status = e.target.status.value;
    editProject(
      user,
      id,
      name,
      start_date,
      status,
      setProjectCreated,
      projectCreated
    );
    handleEditModal();
  };

  // Luo uuden projektin
  const handleProjectCreation = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const start_date = e.target.start_date.value;
    createProject(user, name, start_date, setProjectCreated, projectCreated);
    handleModal();
  };

  // Muuttaa luontilomakkeen paivamaaran taksi paivaksi
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Laskee projektien lukumaaran
  const projectCount = projects.length;

  const tasksCount = projects.reduce((acc, project) => {
    return acc + project.attributes.tasks;
  }, 0);

  const hoursCount = projects.reduce((acc, project) => {
    return acc + project.attributes.total_hours;
  }, 0);

  const marksCount = projects.reduce((acc, project) => {
    return acc + project.attributes.marks_count;
  }, 0);

  const filteredProjects = projects.filter(
    (project) => project.attributes.status === projectStatus
  );

  // Jarjestaa projektin aloituspvm mukaan
  const sortByDate = () => {
    if (sort === "asc") {
      setProjects(projects.sort((a, b) => (a.attributes.start_date > b.attributes.start_date ? 1 : -1)));
      setSort("desc");
    } else {
      setProjects(projects.sort((a, b) => (a.attributes.start_date < b.attributes.start_date ? 1 : -1)));
      setSort("asc");
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }
  return (
    <div className="container">
      <nav>
        <Logout />
      </nav>
      <h2>Tervetuloa {user.name}!</h2>
      <hr />
      <div className="userStats">
        <div className="userStat">
          <p>Projekteja yhteensä:</p>
          <p>{projectCount}</p>
        </div>
        <div className="userStat">
          <p>Tehtäviä yhteensä:</p>
          <p>{tasksCount}</p>
        </div>
        <div className="userStat">
          <p>Merkintöjä yhteensä:</p>
          <p>{marksCount}</p>
        </div>
        <div className="userStat">
          <p>Tunteja yhteensä:</p>
          <p>{hoursCount}</p>
        </div>
      </div>
      <hr />
      {user?.role === "admin" && (
        <div className="tools">
          <button onClick={handleModal}>Luo projekti</button>
          {isModalOpen && (
            <>
              <div className="modalBG" onClick={handleModal}></div>
              <div className="modal">
                <form onSubmit={handleProjectCreation}>
                  <h2>Luo uusi projekti</h2>

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
                    <button type="button" onClick={handleModal}>
                      Peruuta
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
          <button onClick={handleEditModal}>Muokkaa projektia</button>
          {isEditModalOpen && (
            <>
              <div className="modalBG" onClick={handleEditModal}></div>
              <div className="modal">
                <form onSubmit={handleProjectUpdate}>
                  <h2>Muokkaa projektia</h2>
                  <label htmlFor="project_select">Nimi</label>
                  <div className="inputContainer">
                    <select
                      id="project_select"
                      onChange={handleProjectSelection}
                      required
                    >
                      <option value="">Valitse projekti</option>
                      {projects.map((project) => (
                        <option
                          key={project.attributes.id}
                          value={project.attributes.id}
                        >
                          {project.attributes.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedProject && (
                    <>
                      <label htmlFor="update_name"></label>
                      <div className="inputContainer">
                        <input
                          type="text"
                          id="update_name"
                          defaultValue={selectedProject.attributes.name}
                          required
                        />
                      </div>
                      <label htmlFor="update_start_date">Aloitus pvm</label>
                      <div className="inputContainer">
                        <input
                          type="date"
                          id="update_start_date"
                          defaultValue={selectedProject.attributes.start_date}
                          required
                        />
                      </div>
                      <label htmlFor="status">Tila</label>
                      <div className="inputContainer">
                        <select
                          id="status"
                          defaultValue={selectedProject.attributes.status}
                        >
                          <option value="active">Aktiivinen</option>
                          <option value="archived">Päättynyt</option>
                        </select>
                      </div>
                    </>
                  )}
                  <button type="submit">Tallenna</button>
                  <button type="button" onClick={handleEditModal}>
                    Peruuta
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
      <div className="infoTable">
        <div className="viewSelector">Projektit</div>
        <table>
          <thead>
            <tr>
              <th>Nimi</th>
              <th>Tehtävät</th>
              <th>Tunnit</th>
              <th onClick={sortByDate}>Aloitus pvm</th>
              <th>
                <select onChange={(e) => setProjectStatus(e.target.value)}>
                  <option value="active">Aktiivinen</option>
                  <option value="archived">Päättynyt</option>
                </select>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project) => (
              <tr key={project.attributes.id}>
                <td>{project.attributes.name}</td>
                <td>{project.attributes.tasks}</td>
                <td>{project.attributes.total_hours}</td>
                <td>{formatDate(project.attributes.start_date)}</td>
                <td>
                  <Link to={`/projekti/${project.attributes.id}`}>
                    Projektiin
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

export default Home;
