<template>
    <Grid
      :style="{ height: '450px' }"
      :filterable="true"
      :filter="filter"
      @filterchange="filterChange"
      :columns="columns"
      :loader="loader"
    >
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
  </template>
  <script>
  import { Grid, GridToolbar } from '@progress/kendo-vue-grid';
  import { filterBy } from '@progress/kendo-data-query';
  import { Button } from '@progress/kendo-vue-buttons';

  export default {
    components: {
      'grid-toolbar': GridToolbar,
      Grid,
      'kbutton': Button
    },
    data: function () {
      return {
        loader: false,
        isChecked: false,
        filter: null,
      };
    },
    computed: {
      products: function () {
        return filterBy(this.filter);
      },
      columns: function () {
        return [
          {
            field: 'InvoiceID',
            filterable: false,
            title: 'Invoice ID',
            width: '100px',
            columnMenu: false,
          },
          { field: 'Date', filter: 'date', title: 'Date' },
          { field: 'Client', title: 'Client' },
          { field: 'Amount', filter: 'numeric', title: 'Amount' },
          { cell: 'myTemplate', filterable: false, width: '210px' }
        ];
      },
    },
    methods: {
      filterChange: function (ev) {
        this.loader = true;
        // The idea behind using the following setTimeout method is to
        // demonstrate how we can show a loader while fetching data.
        // In real-life scenarios with remote data binding, the 'loader'
        // property should be updated before making a server request
        // and after the request completes.
        setTimeout(() => {
          this.filter = ev.filter;
          this.loader = false;
        }, 300);
      },
      onFilterTypeChange() {
        this.filter = null;
      },
      open(dataItem) {
          this.productInEdit = this.cloneProduct(dataItem);
       },
       remove(dataItem) {
          this.products = this.products.filter(p => p.ProductID !== dataItem.ProductID);
      },
     btnSwitch(){
        this.$router.push('/grid');
      }
    },
  };
  </script>