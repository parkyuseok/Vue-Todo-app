// https://vuex.vuejs.org/kr/guide/modules.html#%EB%84%A4%EC%9E%84%EC%8A%A4%ED%8E%98%EC%9D%B4%EC%8A%A4
export default {
    // todoApp.js를 독립적으로 돌아가길 원한다면 namespaced: true
    namespaced: true,

    // 저장소에서 관리되는 Data (data는 참조관계 문제 때문에 함수로 작성)
    state: () => ({
        db: null,
        todos: []
    }),
    
    // state에 있는 data를 뭔가 계산해서 사용할 때 (Computed)
    getters: {
        total (state) {
            return state.todos.length
        },
        activeCount (state) {
            // todo에 done이 false인 애들만 filter 처리를 하고 그것의 개수를 리턴하면 activeCount가 된다.
            return state.todos.filter(todo => !todo.done).length
        },
        completedCount (state, getters) {
            return getters.total - getters.activeCount
        }
    },

    // Methods
    // 실제 값(state)을 변경할 때 사용(비동기X)
    mutations: {
        // mutations에서는 state에 바로 접근이 가능하다.
        assignDB (state, lowdb) { //lowdb = commit의 두번째 인자로 전달 된 lowdb(adapter)
            state.db = lowdb
        },
        createDB (state, newTodo) {
            state.db
                .get('todos') // lodash
                .push(newTodo) // lodash
                .write() // lowdb
        },
        assignTodos (state, todos) {
            state.todos = todos
        },
        pushTodo (state, newTodo) {
            state.todos.push(newTodo)
        }
    },

    // Methods
    // 비동기를 포함한 일반 로직을 작성할 때 사용(state 변경 X)
    actions: {
        // context에는 state, getters, mutations, actions 등 참조관계에 접근할 수 있는 객체들이 들어있다.
        // const { state } = context,
        initDB ({ state, commit }) { //commit을 통해 mutaion에 접근.
            const adapter = new LocalStorage('todo-app') //DB
            // lowdb에 연결
            // state.db = lowdb(adapter)
            commit('assignDB', lowdb(adapter)) //mutations를 실해하는 개념.

            // state.db.has('todos')까지는 data가 있는지 없는지 체크만 하는 것 체크된 값을 뽑아 내는 것이 value()
            const hasTodos = state.db.has('todos').value()

            if (hasTodos) {
                // state.db.getState().todos는 db에 있는 모든 내용을 가지고 와라. 그 중에 나는 todos만 필요하다
                //_cloneDeep은 복사행위를 가능하게 해주는 lodash에서 제공하는 메소드이다. 
                // 사용하는 이유는 todos는 배열이기 때문에 안에 있는 참조관계도 복사하기 때문에 문제가 생기기 때문에 
                // cloneDeep을 통해서 todos 내부에 있는 모든 참조관계들을 다 제거하고 복사해서 todos에서 활용하겠다는 의미로 깊은 복사를한다.
                // state.todos = _cloneDeep(state.db.getState().todos)
                commit('assignTodos', _cloneDeep(state.db.getState().todos))
            } else {
                // Local DB 초기화
                state.db
                    .defaults({
                        todos: [] //Collection
                })
                .write()
            }
        },
        createTodo ({ state, commit }, title) { //this.title이라는 변수를 title 매개변수로 받는다
            const newTodo = {
                id: cryptoRandomString({ length: 10 }),
                title, //title: title
                createdAt: new Date(),
                updatedAt: new Date(),
                done: false
            }

            // Create DB
            commit('createDB', newTodo)

            // Create Client
            commit('pushTodo', newTodo)
        },
    }
}