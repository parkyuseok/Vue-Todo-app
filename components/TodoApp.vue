<template>
    <!-- template 태그 내부에는 자식요소 1개만 들어갈 수 있어서 div를 만들어서 넣어준다. -->
    <div>
        <todo-item></todo-item>
        <todo-creator></todo-creator>
    </div>
</template>

<script>
import TodoCreator from './TodoCreator' //TodoCreator라는 이름으로 가져온다.
import TodoItem from './TodoItem'

export default {
    // 외부에서 가져온 컴포넌트를 연결하는 옵션
    components: {
        // 가져온 컴포넌트를 연결해준다.
        TodoCreator,
        TodoItem
    }
}
</script>