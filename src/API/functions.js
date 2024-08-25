import axios from "axios";

// Hakee kaikki projektit
export const getProjects = (user, setProjects) => {
    axios.get('http://localhost:3000/projects', {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    }).then(response => {
        setProjects(response.data.data);
        console.log(response.data.data)
    }
    ).catch(error => {
        console.log(error);
    });
}

// Hakee yhden projektin
export const getProject = (user, id, setProject) => {
    axios.get(`http://localhost:3000/projects/${id}`, {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    }).then(response => {
        setProject(response.data[0]);
        console.log(response.data[0])
    }
    ).catch(error => {
        console.log(error);
    });
}

// Luo uuden projektin
export const createProject = (user, name, start_date, setProjectCreated, projectCreated) => {
    axios.post('http://localhost:3000/projects', {
        "project": {
            "name": name,
            "start_date": start_date
        }
    }, {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    }).then(response => {
        console.log(response.data);
        setProjectCreated(!projectCreated);
    }).catch(error => {
        console.log(error);
    }
    );
}

// Muokkaa projektia
export const editProject = (user, id, name, start_date, status, setProjectEdited, projectEdited) => {
    axios.put(`http://localhost:3000/projects/${id}`, {
        "project": {
            "name": name,
            "start_date": start_date,
            "status": status
        }
    }, {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    }).then(response => {
        console.log(response.data);
        setProjectEdited(!projectEdited);
    }).catch(error => {
        console.log(error);
    }
    );
}

// Poistaa projektin
export const deleteProject = (user, id) => {
    axios.delete(`http://localhost:3000/projects/${id}`, {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    }).then(response => {
        console.log(response.data);
    }
    ).catch(error => {
        console.log(error);
    }
    );
}

// Hakee kaikki projektin tehtavat
export const getTasks = (user, id, setTasks) => {

    axios.get(`http://localhost:3000/projects/${id}/tasks`, {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    }).then(response => {
        setTasks(response.data.data);
        console.log(response.data.data)
    }
    ).catch(error => {
        console.log(error);
    }); 
}

// Hakee yhden tehtavan tiedot
export const getTask = (user, id, task_id, setTask) => {
    axios.get(`http://localhost:3000/projects/${id}/tasks/${task_id}`, {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    }).then(response => {
        setTask(response.data.data);
        console.log(response.data.data)
    }
    ).catch(error => {
        console.log(error);
    });
}

// Luo uuden tehtavan
export const createTask = (user, project_id, name, start_date, setTaskCreated, taskCreated) => {
    axios.post(`http://localhost:3000/projects/${project_id}/tasks`, {
        "task": {
            "name": name,
            "start_date": start_date
        }
    }, {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    }).then(response => {
        console.log(response.data);
        setTaskCreated(!taskCreated);
    }).catch(error => {
        console.log(error);
    }
    );
}

// Muokkaa tehtavaa
export const editTask = (user, selectedTask, id, name, start_date, status, setTaskEdited, taskEdited) => {
    axios.put(`http://localhost:3000/projects/${id}/tasks/${selectedTask.attributes.id}`, {
        "task": {
            "name": name,
            "start_date": start_date,
            "status": status
        }
    }, {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    }).then(response => {
        console.log(response.data);
        setTaskEdited(!taskEdited);
    }).catch(error => {
        console.log(error);
    }
    );
}

// Poistaa tehtavan
export const deleteTask = (user, id, task_id) => {
    axios.delete(`http://localhost:3000/projects/${id}/tasks/${task_id}`, {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    }).then(response => {
        console.log(response.data);
    }).catch(error => {
        console.log(error);
    }
    );
}

// Hakee kaikki tehtavaan liittyvat merkinnat
export const getMarks = (user, id, task_id, setMarks) => {
    axios.get(`http://localhost:3000/projects/${id}/tasks/${task_id}/marks`, {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    }).then(response => {
        setMarks(response.data.data);
        console.log(response.data.data)
    }
    ).catch(error => {
        console.log(error);
    });
}

// Luo uuden merkinnan
export const createMark = (user, id, task_id, amount, date, setMarkCreated, markCreated) => {
    axios.post(`http://localhost:3000/projects/${id}/tasks/${task_id}/marks`, {
        "mark": {
            "h_amount": amount,
            "date": date
        }
    }, {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    }).then(response => {
        console.log(response.data);
        setMarkCreated(!markCreated);
    }).catch(error => {
        console.log(error);
    }
    );
}

// Poistaa merkinnan
export const deleteMark = (user, id, task_id, mark_id, setMarkDeleted, markDeleted) => {
    axios.delete(`http://localhost:3000/projects/${id}/tasks/${task_id}/marks/${mark_id}`, {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    }).then(response => {
        console.log(response.data);
        setMarkDeleted(!markDeleted);
    }).catch(error => {
        console.log(error);
    }
    );
}

// Logout
export const logout = (token) => {
    axios.delete('http://localhost:3000/logout', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(response => {
        console.log(response.data);
        localStorage.removeItem('user');
    }).catch(error => {
        console.log(error);
    }
    );
}