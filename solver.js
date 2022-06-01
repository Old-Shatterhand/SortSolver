class State {
    constructor(state, actions, action = null) {
        this.state = state;
        this.actions = actions;
        if (action != null) {
            this.actions.push(action);
        }
    }

    is_terminal() {
        let terminal = true;
        for (let s = 0; s < this.state.length; ++s) {
            terminal = terminal &&
                this.state[s][0] === this.state[s][1] &&
                this.state[s][1] === this.state[s][2] &&
                this.state[s][2] === this.state[s][3];
        }
        return terminal;
    }

    output() {
        let o = "====================\n";
        for (let s = 0 ; s < this.state.length ; ++s) {
            o += this.state[s] + "\n";
        }
        return o + "--------------------\n" + this.actions + "\n--------------------\nterminal?: " + this.is_terminal() + "\n====================\n";
    }
}

function bfs(state) {
    // console.log("Test")
    const start = clone(state);
    var queue = [new State(start, [])];

    while (queue.length !== 0) {
        const c_state = queue.shift();
        // console.log(c_state.output());
        const actions = possible_actions(c_state.state);
        // console.log("Actions: " + actions);

        for (let a = 0; a < actions.length; ++a) {
            let n_state = new State(move(c_state.state, actions[a]), clone(c_state.actions), actions[a]);

            if (n_state.is_terminal()) {
                return n_state.actions;
            } else {
                queue.push(n_state);
            }
        }
    }
}

function possible_actions(state) {
    let actions = [];
    let tops = [];

    for (let a = 0; a < state.length; ++a) {
        if (state[a][0] === colors.BLANK) {
            tops.push(-1);
            continue;
        }

        let a_top = 3;
        while (state[a][a_top] === colors.BLANK) {
            a_top--;
        }
        tops.push(a_top);
    }

    for (let a = 0; a < state.length; ++a) {
        for (let b = 0; b < state.length; ++b) {
            if (a !== b && (tops[b] === -1 && tops[a] !== -1 || (tops[b] !== 3 && state[a][tops[a]] === state[b][tops[b]]))) {
                actions.push([a, b]);
            }
        }
    }
    return actions;
}

function move(state, action) {
    let n_state = clone(state), start = action[0], end = action[1];

    let start_top = 3;
    while (n_state[start][start_top] === colors.BLANK) {
        start_top--;
    }

    let end_top = 3;
    while (n_state[end][end_top] === colors.BLANK) {
        end_top--;
    }
    end_top++;

    let transfer = n_state[start][start_top];
    while (start_top > -1 && end_top < 4 && transfer === n_state[start][start_top]) {
        n_state[end][end_top] = transfer;
        n_state[start][start_top] = colors.BLANK;
        end_top++;
        start_top--;
    }

    return n_state;
}

function clone(array) {
    return array.map(function (e) {
        if (e instanceof Array) {
            return e.map(function (f) {
                return f;
            });
        } else {
            return e;
        }
    });
}