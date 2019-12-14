import { action, computed, configure, decorate, observable, toJS } from "mobx";
import { isEmpty, cloneDeep } from 'lodash';


import { json, Undo, Polymorph } from "json-mobx";
// this is now `flow` from mobx
// import { asyncAction } from "mobx-utils";

// removed as of MobX 4
// useStrict(true);
configure({ enforceActions: "observed" });


// export class TaskModel extends Polymorph {
//     constructor(owner, type) {
//         super(type || "placeholder");
//     }

//     Task = "Eat";
// }

class TaskModel  extends Polymorph{
    constructor(owner, type) {
        super(type || "placeholder");
    }
    task = "eat";
    statue = "not done";
}
decorate(TaskModel, {
    task: [json, observable],
    task: [json, observable],
})


export class MainModel {
    static TaskList = json.array(() => new TaskModel(this))

    DeleteTask = () => {
        this.TaskList.pop();
    }
}


decorate(MainModel, {
    TaskList: [json, observable],
    DeleteTask: [json, action],
})