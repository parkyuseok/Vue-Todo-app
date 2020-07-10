<template>
  <todo-app />
</template>

<script>
import TodoApp from './components/TodoApp' //.vue 생략가능

export default {
  components: {
    /*  가지고 온 컴포넌트를 명시해준다.
        TodoApp라는 이름을 components에 연결하기 위해서
        'todo-app': TodoApp는 'todo-app'이라는 이름의 컴포넌트를 사용할 것이고 
        그건 내가 가지고온 TodoApp이라는 컴포넌트이다.
        + 컴포넌트를 사용할 때 vue 내부에서
        TodoApp(PascalCase 표기법)은 kebab-case로 고쳐준다.
        그래서 'TodoApp': TodoApp이라고 작성할 수 있고
        속성명과 값이 같으면 생략해서 작성할 수 있다.
        따라서 'todo-app': TodoApp => 'TodoApp': TodoApp => TodoApp */
        TodoApp
  }
}
</script>