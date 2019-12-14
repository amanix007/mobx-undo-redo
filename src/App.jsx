import React, { Component } from 'react'
import logo from './logo.svg';
import './App.css';
import { inject, observer, Provider } from "mobx-react";
import { toJS } from 'mobx';

class App extends Component {
  render() {
    let { TaskList, DeleteTask } = this.props.mainModel;
    console.log('this.props.mainModel:', toJS(this.props.mainModel))
    console.log('TaskList:', TaskList)
    return (
      <div>
        {TaskList.map((Task, i) => {
          return <p onClick={DeleteTask}>{Task.Task}</p>
        })}
      </div>
    )
  }
}

export default inject("mainModel")(observer(App));

