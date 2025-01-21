<template>
    <Grid
      :style="{ height: '450px' }"
      :filterable="true"
      :filter="filter"
      @filterchange="filterChange"
      :data-items="data"
      :columns="columns"
      :loader="loader"
    >
    <template v-slot:loader>
        <div class="k-loader-container k-loader-container-md k-loader-top">
        <div class="k-loader-container-overlay k-overlay-dark" style="background-color: lightgray;"/>
        <div class="k-loader-container-inner" >
            <Loader :size="'large'" :type="type" />
        </div>
        </div>
    </template>
    <template v-slot:myTemplate="{props}">
            <custom :data-item="props.dataItem" 
                    @edit="open"
                    @remove="remove"/>
        </template>
    <grid-toolbar>
            <kbutton title="Add new"
                    :theme-color="'primary'"
                    @click="btnSwitch()" >
                Add new
            </kbutton>
        </grid-toolbar>
    </Grid>
    <dialog-container v-if="removeItem" :data-item="itemObj" @save="save" @cancel="close">
    </dialog-container>
    <edit-dialog-container v-if="editItem" :data-item="itemObj" @editInvoice="editInvoice" @editClose="editClose">
    </edit-dialog-container>
  </template>
  <script>
  import { Grid, GridToolbar } from '@progress/kendo-vue-grid';
  import { Button } from '@progress/kendo-vue-buttons';
  import { Loader } from '@progress/kendo-vue-indicators';
  import CommandCell from './CommandCell.vue';
  import DeleteDialog from './DeleteDialog.vue';
  import EditDialog from './EditDialog.vue';
  let str = '';
  export default {
    components: {
      'grid-toolbar': GridToolbar,
      Grid,
      'kbutton': Button,
      Loader,
      custom: CommandCell,
      'dialog-container': DeleteDialog,
      'edit-dialog-container':EditDialog
    },
    beforeCreate(){
      setTimeout(() => {
       this.getFunction();
       this.loader = false;
      }, 1000);
    },
    data: function () {
      return {
        itemObj: undefined,
        editItem: false,
        removeItem: false,
        loader: true,
        data: [],
        columns: [
          { field: 'InvoiceID', filterable: false, title: 'Invoice ID', width: '100px' },
          { field: 'Date', filter: 'date', title: 'Date' },
          { field: 'Client', title: 'Client' },
          { field: 'Amount', filter: 'numeric', title: 'Amount' },
          { cell: 'myTemplate', width: '210px' }
        ]
      };
    },
    methods: {
    getFunction(){
      const testLst = [];
      fetch('https://raven-8f178-default-rtdb.firebaseio.com/Invoices.json'
          ).then(
              res => res.json()
          ).then( data => {
              const lst =  Object.entries(data);
              for (let x = 0; x < lst.length; x ++){
                  testLst.push({InvoiceID: lst[x][0]});
              }
            this.data = testLst;
            localStorage.setItem( 'InvNo', testLst.length + 1);
          }
      );
      return testLst;
    },
     btnSwitch(){
        this.$router.push('/grid');
      },
      close(){
        this.removeItem = false;
      },
      save(){
        this.removeItem = false;
        this.loader = true;
        fetch('https://raven-8f178-default-rtdb.firebaseio.com/Invoices/'+ str +'.json',{
          method: 'DELETE'
        });
        setTimeout(() => {
          this.getFunction();
          this.loader = false;
        }, 1000);
      },
      open(){
        this.editItem = true;
      },
      editClose(){
        this.editItem = false;
      },
      editInvoice(){
        localStorage.setItem('InvNo', )
        this.$router.push('/grid');
      },
      remove(e){
        this.itemObj = e.dataItem;
        str += e.dataItem.InvoiceID;
        this.removeItem = true;
      }
    },
  };
  </script>