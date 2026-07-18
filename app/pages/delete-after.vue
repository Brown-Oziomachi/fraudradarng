<script>
export default {
    data(){
        return{
            message: 'make them dynamic',
            counter:{
                count: 0
            }
        }
    }
}
</script>

<template>
    <h1>{{message}}</h1>
    <p>count is: {{counter.count}}</p>
</template>