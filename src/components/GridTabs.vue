<template>
    <div>
      <TabStrip  :selected="selected" @select="onSelect" :tabs="tabs">
      <template v-slot:TabOne>
        <Dialog />
      </template>
      <template v-slot:TabTwo>
        <FormContent />
      </template>
    </TabStrip>
    </div>
  </template>
  
  <script>
  import { TabStrip } from '@progress/kendo-vue-layout';
  import FormContent from './ClientInforForm.vue';
  import Dialog from './AddItemForm.vue';
  
  export default {
    components: {
      TabStrip,
      'FormContent': FormContent,
      'Dialog': Dialog
    },
    data: function () {
      return {
        selected: 0,
        tabs: [
          {
            title: 'Add Item',
            content: 'TabOne',
          },
          {
            title: 'Add Information',
            content: 'TabTwo',
          },
        ],
      };
    },
    methods: {
      onSelect: function (e) {
        this.selected = e.selected;
      },
    },
  };
  </script>
  