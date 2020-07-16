import Vue from 'vue'
import lowdb from 'lowdb' // https://github.com/typicode/lowdb
import LocalStorage from 'lowdb/adapters/LocalStorage'
import cryptoRandomString from 'crypto-random-string' // https://github.com/sindresorhus/crypto-random-string
import _find from 'lodash/find'
import _assign from 'lodash/assign'
import _cloneDeep from 'lodash/cloneDeep'
import _findIndex from 'lodash/findIndex'
import _forEachRight from 'lodash/forEachRight'

export default {
  // todoApp.js를 독립적으로 돌아가길 원한다면 namespaced: true
  namespaced: true,

  // 저장소에서 관리되는 Data (data는 참조관계 문제 때문에 함수로 작성)
  state: () => ({
    db: null,
    todos: [],
    filter: 'all'
  }),

  // state에 있는 data를 뭔가 계산해서 사용할 때 (Computed)
  getters: {
    filteredTodos (state) {
      switch (state.filter) {
        case 'all':
        default: // case와 default 일 경우.
          return state.todos
        case 'active': // 해야 할 항목
          return state.todos.filter(todo => !todo.done)
        case 'completed': // 완료된 항목
          return state.todos.filter(todo => todo.done)
      }
    },
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
    assignDB (state, lowdb) { // lowdb = commit의 두번째 인자로 전달 된 lowdb(adapter)
      state.db = lowdb
    },
    createDB (state, newTodo) {
      state.db
        .get('todos') // lodash
        .push(newTodo) // lodash
        .write() // lowdb
    },
    updateDB (state, { todo, value }) {
      state.db
        .get('todos')
        .find({ id: todo.id })
        .assign(value)
        .write()
    },
    deleteDB (state, todo) {
      state.db
        .get('todos')
        .remove({ id: todo.id })
        .write()
    },
    assignTodos (state, todos) {
      state.todos = todos
    },
    assignTodo (state, { foundTodo, value }) {
      _assign(foundTodo, value)
    },
    pushTodo (state, newTodo) {
      state.todos.push(newTodo)
    },
    deleteTodo (state, foundIndex) {
      Vue.delete(state.todos, foundIndex)
    },
    updateTodo (state, { todo, key, value }) {
      todo[key] = value
    },
    updateFilter (state, filter) {
      state.filter = filter
    }
  },

  // Methods
  // 비동기를 포함한 일반 로직을 작성할 때 사용(state 변경 X)
  actions: {
    initDB ({ state, commit }) { // commit을 통해 mutaion에 접근.
      const adapter = new LocalStorage('todo-app') // DB
      // state.db = lowdb(adapter)
      commit('assignDB', lowdb(adapter)) // mutations를 실해하는 개념.

      const hasTodos = state.db.has('todos').value()

      if (hasTodos) {
        // state.db.getState().todos는 db에 있는 모든 내용을 가지고 와라. 그 중에 나는 todos만 필요하다
        // _cloneDeep은 복사행위를 가능하게 해주는 lodash에서 제공하는 메소드이다.
        // 사용하는 이유는 todos는 배열이기 때문에 안에 있는 참조관계도 복사하기 때문에 문제가 생기기 때문에
        // cloneDeep을 통해서 todos 내부에 있는 모든 참조관계들을 다 제거하고 복사해서 todos에서 활용하겠다는 의미로 깊은 복사를한다.
        // state.todos = _cloneDeep(state.db.getState().todos)
        commit('assignTodos', _cloneDeep(state.db.getState().todos))
      } else {
        // Local DB 초기화
        state.db
          .defaults({
            todos: [] // Collection
          })
          .write()
      }
    },
    createTodo ({ state, commit }, title) { // this.title이라는 변수를 title 매개변수로 받는다
      const newTodo = {
        id: cryptoRandomString({ length: 10 }),
        title, // title: title
        createdAt: new Date(),
        updatedAt: new Date(),
        done: false
      }

      // Create DB
      commit('createDB', newTodo)

      // Create Client
      commit('pushTodo', newTodo)
    },
    updateTodo ({ state, commit }, { todo, value }) {
      // Update DB
      commit('updateDB', { todo, value })

      const foundTodo = _find(state.todos, { id: todo.id })
      commit('assignTodo', { foundTodo, value })
    },
    deleteTodo ({ state, commit }, todo) {
      // Delete DB
      commit('deleteDB', todo)

      const foundIndex = _findIndex(state.todos, { id: todo.id })
      // Delete Client
      commit('deleteTodo', foundIndex)
    },
    completeAll ({ state, commit }, checked) {
      // DB
      const newTodos = state.db
        .get('todos')
        .forEach(todo => {
          // todo.done = checked
          commit('updateTodo', {
            todo,
            key: 'done',
            value: checked
          })
        })
        .write()

      // state.todos = _cloneDeep(newTodos)
      commit('assignTodos', _cloneDeep(newTodos))
    },
    clearCompleted ({ state, dispatch }) {
      _forEachRight(state.todos, todo => {
        if (todo.done) {
          // state.deleteTodo(todo)
          dispatch('deleteTodo', todo)
        }
      })
    }
  }
}
