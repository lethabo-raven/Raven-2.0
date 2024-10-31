<template>
  <div style="padding: 5px;">
    <div class="container text-left">
      <div class="row align-text-start">
        <div class="col">
          <div class="mb-3">
        <datepicker
        :required="true"
        :defaultValue="defaultValue"
        :label="'Invoice Date'"
        :format="'yyyy-MM-dd'"
        :style="{ width: '250px' }"></datepicker>
        </div>
        <div class="mb-3">
          <KInput 
          :required="true"
          :label="'Client Name'"
          :style="{ width: '250px' }"
          
          ></KInput>
        </div>
        </div>
        <div class="col">
          <div class="mb-3">
          Client Address
          <br/>
          <TextArea 
          :style="{ width: '250px'}"
          :required="true"
          :autoSize="true"
          :rows="1"
          :label="'Address'"
          ></TextArea>
        </div>
        <div class="mb-3">
          <KInput 
          :label="'Client Email Address'"
          :required="true"
          :style="{ width: '250px' }"></KInput>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Input, TextArea } from '@progress/kendo-vue-inputs';
import { DatePicker } from '@progress/kendo-vue-dateinputs';

export default {
  components: {
    KInput: Input,
    datepicker: DatePicker,
    TextArea: TextArea
    
  },
  data: function(){
    return{
      defaultValue: new Date()
    }
  }
};
</script>