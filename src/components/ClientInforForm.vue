<template>
  <div style="padding: 5px;">
    <div class="container text-left">
      <div class="col-xs-12 col-md-6 row align-text-start">
        <div class="col">
          <div>
        <datepicker
          :required="true"
          :defaultValue="defaultValue"
          :label="'Invoice Date'"
          :format="'yyyy-MM-dd'"
        ></datepicker>
        </div>
        <div >
          <KInput 
          :required="true"
          :label="'Client Name'"
          ></KInput>
        </div>
        </div>
        <div class="col">
          <div >
          Client Address
          <br/>
          <TextArea 
          :required="true"
          :autoSize="true"
          :rows="1"
          :label="'Address'"
          ></TextArea>
        </div>
        <div >
          <KInput 
          :label="'Client Email Address'"
          :required="true"
          ></KInput>
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