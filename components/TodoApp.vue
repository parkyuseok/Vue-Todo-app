<template>
    <!-- template 태그 내부에는 자식요소 1개만 들어갈 수 있어서 div를 만들어서 넣어준다. -->
    <div class="todo-app">

        <div class="todo-app__actions">
            <div class="filters">
                <button 
                    :class="{ active: filter == 'all' }"
                    @click="changeFilter('all')">
                        모든 항목 ({{ total }})
                </button>
                <button 
                    :class="{ active: filter == 'active' }"
                    @click="changeFilter('active')">
                        해야 할 항목 ({{ activeCount }})
                </button>
                <button 
                    :class="{ active: filter == 'completed' }"
                    @click="changeFilter('completed')">
                    완료된 항목 ({{ completedCount }})
                </button>
            </div>

            <div class="actions clearfix">
                <div class="float--left">
                    <label>
                        <input 
                            v-model="allDone"
                            type="checkbox"
                        />
                        <span class="icon">
                            <i class="material-icons">done_all</i>
                        </span>
                    </label>
                </div>
                <div class="float--right clearfix">
                    <button 
                        class="btn float--left"
                        @click="scrollToTop"
                    >
                        <i class="material-icons">expand_less</i>
                    </button>
                    <button 
                        class="btn float--left"
                        @click="scrollToBottom"
                    >
                        <i class="material-icons">expand_more</i>
                    </button>
                    <button 
                        class="btn btn--danger float--left"
                        @click="clearCompleted">
                            <i class="material-icons">delete_sweep</i>
                    </button>
                </div>
            </div>

        </div>

        <div class="todo-app__list">
            <!-- :todo="todo"는 todo라는 props를 통해 data를 전달하고 있다. -->
            <todo-item 
                v-for="todo in filteredTodos"
                :key="todo.id"
                :todo="todo"
                @update-todo="updateTodo"
                @delete-todo="deleteTodo"
            />
        </div>

        <todo-creator 
            class="todo-app__creator"
            @create-todo="createTodo" />
    </div>
</template>

<script>
// 일반적으로 node_modules에서 가져오는 것은 상단에 배치하는 것이 좋다.(상대 경로랑 구분)
import lowdb from 'lowdb' // https://github.com/typicode/lowdb
import LocalStorage from 'lowdb/adapters/LocalStorage'
import cryptoRandomString from 'crypto-random-string' // https://github.com/sindresorhus/crypto-random-string
import _cloneDeep from 'lodash/cloneDeep'
import _find from 'lodash/find'
import _assign from 'lodash/assign'
import _findIndex from 'lodash/findIndex'
import _forEachRight from 'lodash/forEachRight'
import scrollTo from 'scroll-to'
// 상대경로로 작성해서 가져오는 것
import TodoCreator from './TodoCreator' //TodoCreator라는 이름으로 가져온다.
import TodoItem from './TodoItem'

export default {
    // 외부에서 가져온 컴포넌트를 연결하는 옵션
    components: {
        // 가져온 컴포넌트를 연결해준다.
        TodoCreator,
        TodoItem
    },
    data () {
        return {
            db: null,
            todos: [],
            filter: 'all'
        }
    },
    // 계산된 데이터
    computed: {
        filteredTodos () {
            switch (this.filter) {
                case 'all':
                default: //case와 default 일 경우.
                    return this.todos
                case 'active': // 해야 할 항목
                    return this.todos.filter(todo => !todo.done)
                case 'completed': // 완료된 항목
                    return this.todos.filter(todo => todo.done)
            }
        },
        total () {
            return this.todos.length
        },
        activeCount () {
            // todo에 done이 false인 애들만 filter 처리를 하고 그것의 개수를 리턴하면 activeCount가 된다.
            return this.todos.filter(todo => !todo.done).length
        },
        completedCount () {
            return this.total - this.activeCount
        },
        allDone: {
            get () {
                return this.total === this.completedCount && this.total > 0
            },
            set (checked) {
                this.completeAll(checked)
            }
        }
    },
    // TodoApp.vue라는 컴포넌트가 생성되고 나서 직후에 바로 호출된다.
    created () {
        this.initDB()
    },
    methods: {
        initDB () {
            const adapter = new LocalStorage('todo-app') //DB
            // lowdb에 연결
            this.db = lowdb(adapter)

            // this.db.has('todos')까지는 data가 있는지 없는지 체크만 하는 것 체크된 값을 뽑아 내는 것이 value()
            const hasTodos = this.db.has('todos').value()

            if (hasTodos) {
                // this.db.getState().todos는 db에 있는 모든 내용을 가지고 와라. 그 중에 나는 todos만 필요하다
                //_cloneDeep은 복사행위를 가능하게 해주는 lodash에서 제공하는 메소드이다. 
                // 사용하는 이유는 todos는 배열이기 때문에 안에 있는 참조관계도 복사하기 때문에 문제가 생기기 때문에 
                // cloneDeep을 통해서 todos 내부에 있는 모든 참조관계들을 다 제거하고 복사해서 todos에서 활용하겠다는 의미로 깊은 복사를한다.
                this.todos = _cloneDeep(this.db.getState().todos)
            } else {
                // Local DB 초기화
                this.db
                    .defaults({
                        todos: [] //Collection
                })
                .write()
            }

        },
        createTodo (title) { //this.title이라는 변수를 title 매개변수로 받는다
            const newTodo = {
                id: cryptoRandomString({ length: 10 }),
                title, //title: title
                createdAt: new Date(),
                updatedAt: new Date(),
                done: false
            }

            // Create DB
            this.db
                .get('todos') // lodash
                .push(newTodo) // lodash
                .write() // lowdb
            // Create Client
            this.todos.push(newTodo)
        },
        updateTodo (todo, value) {
            console.log("Test")
            this.db
                .get('todos')
                .find({ id: todo.id })
                .assign(value)
                .write()
            
            const foundTodo = _find(this.todos, { id: todo.id })
            _assign(foundTodo, value)
        },
        deleteTodo (todo) {
            this.db
                .get('todos')
                .remove({ id: todo.id })
                .write()
            const foundIndex = _findIndex(this.todos, { id: todo.id })
            this.$delete(this.todos, foundIndex)
        },
        changeFilter (filter) {
            this.filter = filter
        },
        completeAll (checked) {
            // DB
            const newTodos = this.db
                .get('todos')
                .forEach(todo => {
                    todo.done = checked 
                })
                .write()

            // Local todos
            // this.todos.forEach(todo => {
            //     todo.done = checked
            // })
            this.todos = _cloneDeep(newTodos) //지금 같은 경우에는 참조관계 때문에 cloneDeep을 쓴다.
        },
        clearCompleted () {
            // this.todos.forEach(todo => {
            //     if (todo.done) {
            //         this.deleteTodo(todo)
            //     }
            // })
            // 위에는 앞에서 부터 삭제, 삭제시 문제 발생함 아래는 뒤에서 부터 삭제하는 native code
            // this.todos
            //     .reduce((list, todo, index) => {
            //         if (todo.done) {
            //             list.push(index)
            //         }
            //         return list
            //     }, [])
            //     .reverse()
            //     .forEach(index => {
            //         this.deleteTodo(this.todos[index])
            //     })

            _forEachRight(this.todos, todo => {
                if (todo.done) {
                    this.deleteTodo(todo)
                }
            })
        },
        scrollToTop () {
            scrollTo(0, 0, {
                ease: 'linear',
            })
        },
        scrollToBottom () {
            scrollTo(0, document.body.scrollHeight, {
                ease: 'linear',
            })
        }
    }
}
</script>

<style lang="scss">
    @import "../scss/style"; //SCSS partials라는 개념에 의해 _(언더바) 사라짐
</style>