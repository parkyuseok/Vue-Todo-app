<template>
    <!-- template 태그 내부에는 자식요소 1개만 들어갈 수 있어서 div를 만들어서 넣어준다. -->
    <div>
        <todo-item />
        <todo-creator @create-todo="createTodo" />
    </div>
</template>

<script>
// 일반적으로 node_modules에서 가져오는 것은 상단에 배치하는 것이 좋다.(상대 경로랑 구분)
import lowdb from 'lowdb' // https://github.com/typicode/lowdb
import LocalStorage from 'lowdb/adapters/LocalStorage'
import cryptoRandomString from 'crypto-random-string' // https://github.com/sindresorhus/crypto-random-string
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
            db: null
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

            // Local DB 초기화
            this.db
                .defaults({
                    todos: [] //collection
            })
            .write()
        },
        createTodo (title) { //this.title이라는 변수를 title 매개변수로 받는다
            const newTodo = {
                id: cryptoRandomString({ length: 10 }),
                title, //title: title
                createdAt: new Date(),
                updatedAt: new Date(),
                done: false
            }

            this.db
            .get('todos') // lodash
            .push(newTodo) // lodash
            .write() // lowdb
        }
    }
}
</script>