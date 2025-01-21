<template>
    <div>
      <k-dialog
        :width="500"
        :height="700"
        @close="close"
      >
        <div>
            
        </div>
        <dialog-actions-bar>
          <kbutton @click="editInvoice">Edit Invoice</kbutton>
          <kbutton @click="save">Send Email</kbutton>
          <kbutton :theme-color="'primary'" @click="editClose">Cancel</kbutton>
        </dialog-actions-bar>
      </k-dialog>
    </div>
  </template>
  <script>
  import { Dialog, DialogActionsBar } from '@progress/kendo-vue-dialogs';
  import { Button } from '@progress/kendo-vue-buttons';
  
  export default {
    components: {
      'k-dialog': Dialog,
      'dialog-actions-bar': DialogActionsBar,
      kbutton: Button,
    },
    methods: {
        editInvoice(){
        this.$emit('editInvoice');
      },
      save(){
        this.$emit('save');
      },
      editClose(){
        this.$emit('editClose');
      },
    },
  };
  </script>
  