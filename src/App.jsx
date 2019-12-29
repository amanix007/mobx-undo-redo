import React, { Component } from 'react'
import logo from './logo.svg';
import './App.css';
import { inject, observer, Provider } from "mobx-react";
import { toJS } from 'mobx';

class App extends Component {

  TaskNameChange = (e, i) => {
    let { value } = e.target;
    this.props.mainModel.TaskNameChange(i, value);
  }

  TaskStatusChange = (e, i) => {
    let { value } = e.target;
    this.props.mainModel.TaskStatusChange(i, value);
  }
  render() {
    let { TaskList, AddTask, DeleteTask, Undo, Redo } = this.props.mainModel;
    // console.log('this.props.mainModel:', toJS(this.props.mainModel))
    // console.log('TaskList:', toJS(TaskList))
    return (
      <div>
        {TaskList.map((Task, i) => {
          return <p key={i}>
            <br />
            <input type="text" value={Task.task} onChange={(e) => this.TaskNameChange(e, i)} />
            <input type="text" value={Task.status} onChange={(e) => this.TaskStatusChange(e, i)} />
            {}</p>
        })}
        <button onClick={AddTask}>add</button>
        <button onClick={DeleteTask}>delete</button>

        <br />
        <br />
        <br />
        <button onClick={Redo}>redo</button>
        <button onClick={Undo}>undo</button>



      </div>
    )
  }
}

export default inject("mainModel")(observer(App));

