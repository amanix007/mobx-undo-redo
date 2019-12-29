import { action, computed, configure, decorate, observable, toJS, autorun, reaction, intercept } from "mobx";
import { isEmpty, cloneDeep } from 'lodash';
import { deepObserve } from "mobx-utils";
import { List } from "immutable";

// import { json, Undo, Polymorph } from "json-mobx";
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





export class MainModel {
    TaskList = [{
        task: "eat",
        status: "Not Done"
    }];

    history = [List([])];
    historyIndex = 0;
    UndoStack = [];
    RedoStack = [];

    DeleteTask = () => {
        this.TaskList.pop();
    }
    AddTask = () => {
        this.TaskList.push({
            task: "eat 3",
            status: "Not Done 3"
        });
    }

    operation = (fn) => {
        let { historyIndex, history } = this;
        // first, make sure that there is no future
        // in the history list. for instance, if the user
        // draws something, clicks undo, and then
        // draws something else, we need to dispose of the
        // future state
        history = history.slice(0, historyIndex + 1);

        // create a new version of the data by applying
        // a given function to the current head
        var newVersion = fn(history[historyIndex]);
        console.log(newVersion);

        // add the new version to the history list and increment
        // the index to match
        history.push(newVersion);
        historyIndex++;

        // redraw the dots
        this.draw();
    }

    draw = () => {
        let { historyIndex, history } = this;
        history[historyIndex].forEach((item) => {

            this.TaskList.push(item);

        });
        // undo.disabled = (historyIndex != 0) ? '' : 'disabled';
        // redo.disabled = (historyIndex !== history.length - 1) ? '' : 'disabled';
    }

    Undo = () => {
        // let lastActivity = this.UndoStack[0];
        // console.log('lastActivity:', toJS(lastActivity))

        // if (lastActivity) {
        //     this.RedoStack.push(lastActivity);
        //     this.TaskList = lastActivity;
        // }
        let { historyIndex, history } = this;
        if (historyIndex > 0) historyIndex--;
        this.draw();
    }
    Redo = () => {
        // let lastActivity = this.RedoStack[0];

        // if (lastActivity) {
        //     this.UndoStack.push(lastActivity);
        //     this.TaskList = lastActivity;
        // }
        let { historyIndex, history } = this;
        if (historyIndex < history.length) historyIndex++;
        this.draw();

    }


    disposer = deepObserve(this.TaskList, (change, path) => {
        if (change.type === "splice") {
            let myobj = {
                index: path,

            }
            this.UndoStack.push(change.object);

            console.log('change obj:', toJS(change.object))
        }
    });


    // disposer2 = intercept(this, "TaskList", change => {
    //     console.log('change:', change)
    //     if (!change.newValue) {
    //         // ignore attempts to unset the background color
    //         return null
    //     }
    //     if (change.newValue.length === 6) {
    //         // correct missing '#' prefix
    //         change.newValue = "#" + change.newValue
    //         return change
    //     }
    //     if (change.newValue.length === 7) {
    //         // this must be a properly formatted color code!
    //         return change
    //     }
    //     if (change.newValue.length > 10) this.disposer2() // stop intercepting future changes
    //     throw new Error("This doesn't like a color at all: " + change.newValue)
    // })

    reaction2 = reaction(
        () => this.TaskList.map(task => task.task),
        (task, reaction) => {
            this.UndoStack.push(task);
            // console.log('this:', this)
            // console.log("reaction 5:", toJS(task));

            // console.log('this.UndoStack', toJS(this.UndoStack));
        },
        {
            fireImmediately: true
        }
    );

    // autorun1 = autorun(() => {
    //     console.log("autorun 1:", this.TaskList.map(task => task.task).join(", "))
    // });

    TaskNameChange = (i, v) => {
        this.TaskList[i].task = v;
    };
    TaskStatusChange = (i, v) => {
        this.TaskList[i].status = v;
    };

}

decorate(MainModel, {
    TaskList: observable,

    UndoStack: observable,
    RedoStack: observable,


    AddTask: action,
    DeleteTask: action,
    Undo: action,
    Redo: action,
    TaskNameChange: action,
    TaskStatusChange: action,
})