<template>
            <div class="container-fluid" >
                <div>
                    <div style="background-color: aliceblue; margin-bottom: 1%;">
                        <h3>Add Invoice Information</h3>
                        <formcontent/>
                    </div>
                </div>
            </div>
         <Grid ref="grid"
            :style="{height: '300px'}"
            :data-items="invItems"
            :columns="columns"
            :edit-field="'inEdit'">
        <template v-slot:myTemplate="{props}">
            <custom :data-item="props.dataItem" 
                    @edit="edit"
                    @remove="remove"
                    />      
        </template>
        <grid-toolbar>
            <dropdownlist
                :style="{ width: '200px' }"
                :text-field="'Court'"
                :data-items="courtData"
                :name="'Court'"
                @change="courtChange"
                @filterchange="filterChangeCourt"
                :default-item="defaultCourt"
                :value="court"
                :filterable="true"
                v-on:open="loadCourtData"
                />
                <dropdownlist
                :style="{ width: '250px' }"
                :disabled="!hasCourt"
                :data-items="categoryData"
                :name="'Category'"
                :text-field="'Category'"
                @change="categoryChange"
                @filterchange="filterChange"
                :default-item="defaultCategory"
                :value="Category"
                :filterable="true"
                />
                <kbutton :theme-color="'primary'" @click="addNewItem">Add New Item</kbutton>
        </grid-toolbar>
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
</template>
<script>
import { Grid, GridToolbar, GridNoRecords } from '@progress/kendo-vue-grid';
import { items } from '@/appdata/InvoiceItems.js';
import DialogContainer from './AddItemForm.vue';
import CommandCell from './CommandCell.vue';
import { Button } from '@progress/kendo-vue-buttons';
import { Form } from '@progress/kendo-vue-form';
import FormContent from './ClientInforForm.vue';
import { DropDownList } from '@progress/kendo-vue-dropdowns';
import { data } from '@/appdata/data.js';
import { filterBy } from '@progress/kendo-data-query';

const delay = 500;
const courtlist = [];
let categorylist = [];
export default {
    components: {
        'Grid': Grid,
        'grid-toolbar': GridToolbar,
        'grid-norecords': GridNoRecords,
        'custom': CommandCell,
        'kbutton': Button,
        'k-form': Form,
        'formcontent': FormContent,
        dropdownlist: DropDownList
    },
    computed:{
        hasCourt: function () {
      return this.court && this.court !== this.defaultCourt
    }
    },
    data: function () {
        return {
            invItems: items,
            productInEdit: undefined,
            columns: [
                { field: 'ID', editable: false, title: 'ID', width: '80px' },
                { field: 'Date', title: 'Date', format: '{0:dd-MM-yyyy}', editor: 'date', width: '200px'},
                { field: 'Item', title: 'Item' },
                { field: 'Price', title: 'Price', width: '100px' , editable: false},
                { field: 'Quantity', title: 'Quantity', filter: 'numeric', width: '100px', editor: 'numeric' },
                { field: 'Amount', title: 'Amount', width: '100px', editable: false },
                { cell: 'myTemplate', width: '210px' }
            ],
            court: null,
            Category: null,
            defaultCourt: { Court: 'Select Court ...' },
            defaultCategory: { Category: 'Select Category ...' },
            categoryData: [],
            courtData: [],
            data: data,
        };
    },
    methods: {
        addNewItem(){
            const dataItem = { inEdit: true };
            this.invItems.splice(0, 0, dataItem)
        },
        geninv(){
            this.$router.push('/invoice');
        },
       edit(dataItem) {
          dataItem
          this.productInEdit = this.cloneProduct(dataItem);
       },
       loadCourtData(){
        let courtObject = {Court: data[0].Court};
        courtlist.push(courtObject)
        for (let x = 1; x < data.length; x++){
            if(data[x].Court ==  data[x - 1].Court){
                continue
            }
            else{
                let courtObject = {Court: data[x].Court};
                courtlist.push(courtObject)
            }
        }
        this.courtData = courtlist;
       },
       courtChange(event) {
        categorylist = [];
        const court1 = event.value;
        const products = data.filter(
        (Court) => Court.Court === court1.Court
        );
        let categoryObject = {Category: products[0].Category};
        categorylist.push(categoryObject)
        for (let x = 1; x < products.length; x++){
            if(products[x].Category ==  products[x - 1].Category){
                continue
            }
            else{
                let categoryObject = {Category: products[x].Category};
                categorylist.push(categoryObject)
            }
        }
        this.Category = null;
        this.court = court1;
        this.categoryData = categorylist;
        },
       categoryChange(event) {
        const category1 = event.value;
        this.Category = category1;
        },
        filterChange(event) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.categoryData = this.filterData(event.filter);
            this.loading = false;
        }, delay);

        this.loading = true;
        },
            filterData(filter) {
                const data = categorylist.slice();
                return filterBy(data, filter);
            },
        filterChangeCourt(event) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.courtData = this.filterCourtData(event.filter);
            this.loading = false;
            
        }, delay);
        this.loading = true;
        },
        filterCourtData(filter) {
        const data = courtlist.slice();
        return filterBy(data, filter);
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
          let arrNo = dataList.length + 1;
          for (let x = 0; x < dataList.length; x ++){
            dataList[x].ID = arrNo - 1;
            arrNo --;
          };
          let size = this.products.length;
          for (let x = 0; x < size; x++){
            this.products.pop();
          };
          for(let item of dataList){
            this.products.push(item)
          };
        },
    }
};

</script>
