<template>
    <div>
      <Dialog
        :title="'Please confirm'"
        @close="close"
      >
        <p :style="{ margin: '25px', textAlign: 'center' }">
          Are you sure you want to delete {{ dataItem.InvoiceID }} ?
        </p>
        <DialogActionsBar>
          <KButton @click="close">No</KButton>
          <KButton @click="save">Yes</KButton>
        </DialogActionsBar>
      </Dialog>
    </div>
  </template>
  <script>
  import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
  import { Button } from "@progress/kendo-vue-buttons";
  
  export default {
    components: {
      Dialog,
      DialogActionsBar,
      KButton: Button,
    },
    props: {
    dataItem: Object,
  },
    methods: {
      close(){
        this.$emit('cancel');
      },
      save(){
        this.$emit('save');
      },
    },
  };
  </script>