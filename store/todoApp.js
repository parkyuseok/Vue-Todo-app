// https://vuex.vuejs.org/kr/guide/modules.html#%EB%84%A4%EC%9E%84%EC%8A%A4%ED%8E%98%EC%9D%B4%EC%8A%A4
export default {
    // todoApp.js를 독립적으로 돌아가길 원한다면 namespaced: true
    namespaced: true,

    // 저장소에서 관리되는 Data (data는 참조관계 문제 때문에 함수로 작성)
    state: () => ({

    }),
    
    // state에 있는 data를 뭔가 계산해서 사용할 때 (Computed)
    getters: {},

    // Methods
    // 실제 값(state)을 변경할 때 사용(비동기X)
    mutation: {},
    
    // Methods
    // 비동기를 포함한 일반 로직을 작성할 때 사용(state 변경 X)
    actions: {}
}