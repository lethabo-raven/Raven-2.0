<template>
    <td v-if="!dataItem.inEdit">{{ dataItem[field] }}</td>
    <td v-else>
        <DatePicker
            :format="'yyyy/MM/dd'"
            @change="change"
        ></DatePicker>
    </td>
</template>
<script>
import { DatePicker } from '@progress/kendo-vue-dateinputs';
export default{
    components:{
        DatePicker: DatePicker
    },
    props:{
        dataItem: Object,
        field: String
    },
    data: function(){
        return{
        }
    },
    methods:{
        change(e){
            localStorage.removeItem('dateValue');
            const d = e.target.value;
            let month = d.getMonth() + 1;
            if(month < 10){
                month = '0' + month;
            }
            let day = d.getDate();
            if(day < 10){
                day = '0' + day
            }
            let date = d.getFullYear() + '/' + month + '/' + day;
            localStorage.setItem('dateValue', date);
        }
    }
}

</script>