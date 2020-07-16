<template>
    <!-- template 태그 내부에는 자식요소 1개만 들어갈 수 있어서 div를 만들어서 넣어준다. -->
    <div class="todo-app">

        <div class="todo-app__actions">
            <div class="filters">
                <router-link 
                    to="/todos/all"
                    tag="button"> <!-- /todos/all 대신에 all만 적어도 동일한 효과 -->
                        모든 항목 ({{ total }})
                </router-link>
                <router-link  
                    to="/todos/active"
                    tag="button">
                        해야 할 항목 ({{ activeCount }})
                </router-link >
                <router-link  
                    to="/todos/completed"
                    tag="button">
                    완료된 항목 ({{ completedCount }})
                </router-link >
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
            />
        </div>

        <todo-creator class="todo-app__creator" />
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex' // store에 있는 state와 getters를 가져와서 computed 속성에 매핑한다.
import scrollTo from 'scroll-to'
import TodoCreator from '~/components/TodoCreator' //TodoCreator라는 이름으로 가져온다.
import TodoItem from '~/components/TodoItem'

export default {
    // 외부에서 가져온 컴포넌트를 연결하는 옵션
    components: {
        // 가져온 컴포넌트를 연결해준다.
        TodoCreator,
        TodoItem
    },
    // 계산된 데이터
    computed: {
        // Halpers
        // 전개 연산자
        ...mapState('todoApp', [
            'todos'
        ]),
        ...mapGetters('todoApp', [
            'total',
            'activeCount',
            'completedCount'
        ]),
        filteredTodos () {
            switch (this.$route.params.id) {
                case 'all':
                default: //case와 default 일 경우.
                    return this.todos
                case 'active': // 해야 할 항목
                    return this.todos.filter(todo => !todo.done)
                case 'completed': // 완료된 항목
                    return this.todos.filter(todo => todo.done)
            }
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
        
        // vuex를 설치하면 store 객체에 접근할 수 있다.
        // todoApp.js에서 .js는 생략하고 모듈이름만 적어준다.
        // this.$store.dispatch('todoApp/updateTodo', {
        //     todo: todo,
        //     value
        // })
    },
    methods: {
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
    // webpack에서 설정한 alias를 통해 절대경로로 작성해줌.
    @import "scss/style"; //SCSS partials라는 개념에 의해 _(언더바) 사라짐

    .filters button.router-link-active {
        background: royalblue;
        color: white;
    }
</style>