<template>
 <div class="example-wrapper">
        <div style="margin-bottom: 10px;"> 
            <GridTabs/>
        </div>
         <Grid ref="grid"
            :style="{height: '280px'}"
            :data-items="products"
            :columns="columns">
        <template v-slot:myTemplate="{props}">
            <custom :data-item="props.dataItem" 
                    @edit="edit"
                    @remove="remove"
                    />      
        </template>
        <grid-norecords>
            There is no data available custom
        </grid-norecords>
        </Grid>
        <div style="padding: 10px; left: 0px;">
            <kbutton 
                    :theme-color="'primary'"
                    @click='geninv'
                    type="submit" >
                Generate Invoice
            </kbutton>
        </div>
    </div>
</template>
<script>
import { Grid, GridToolbar, GridNoRecords } from '@progress/kendo-vue-grid';
import { items } from '@/appdata/InvoiceItems.js';
import  Dialog  from './EditItemDialog.vue';
import DialogContainer from './AddItemForm.vue';
import CommandCell from './CommandCell.vue';
import { Button } from '@progress/kendo-vue-buttons';
import { Form } from '@progress/kendo-vue-form';
import FormContent from './ClientInforForm.vue';
import GridTabs from './GridTabs.vue';

export default {
    components: {
        'Grid': Grid,
        'grid-toolbar': GridToolbar,
        'grid-norecords': GridNoRecords,
        'dialog-container': DialogContainer,
         'custom': CommandCell,
        'kbutton': Button,
        'k-form': Form,
      'formcontent': FormContent,
      'GridTabs': GridTabs
    },
    data: function () {
        return {
            products: items,
            productInEdit: undefined,
            columns: [
                { field: 'ID', editable: false, title: 'ID', width: '80px' },
                { field: 'Date', title: 'Date', format: '{0:yyyy-MM-dd}', width: '100px'},
                { field: 'Item', title: 'Item' },
                { field: 'Price', title: 'Price', width: '100px' },
                { field: 'Quantity', title: 'Quantity', filter: 'numeric', width: '100px', editor: 'numeric' },
                { field: 'Amount', title: 'Amount', width: '100px' },
                { cell: 'myTemplate', width: '210px' }
            ]
        };
    },
    methods: {
        geninv(){
            this.$router.push('/invoice');
        },
       edit(dataItem) {
          dataItem
          this.productInEdit = this.cloneProduct(dataItem);
       },
       remove(dataItem) {
          const dataList = [];
          for (let item of this.products){
            if( item.ID !== dataItem.ID){
                dataList.push(item);
            }
            else{
                continue;
            }
          }
          for (let x = 0; x < dataList.length; x++){
            dataList[x].ID = x + 1;
          }
          this.products = [];
          this.products = dataList;
          console.log(dataItem.ID)
      },
    }
};

</script>
