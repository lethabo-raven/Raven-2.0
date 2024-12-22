<template>
            <div  >
                <div>
                    <div style="background-color: aliceblue; margin-bottom: 1%;">
                        <h3 style="margin: 1%;">Add Invoice Information</h3>
                        <formcontent/>
                    </div>
                </div>
            </div>
         <Grid ref="grid"
            :style="{height: '330px'}"
            :data-items="invItems"
            :columns="columns"
            :edit-field="'inEdit'">
        <template v-slot:myTemplate="{props}">
            <custom :data-item="props.dataItem"
                    @edit="edit"
                    @remove="remove"
                    @save="save"
                    @cancel="cancel"
                    />      
        </template>
        <template v-slot:itemDropDown="{ props }">
            <dropdown
            :data-item="props.dataItem"
            :field="props.field"
            @change="(e) => dropdownChange(e, props.dataItem)"
            />
        </template>
        <template v-slot:quantity="{ props }">
            <quantity
            :data-item="props.dataItem"
            :field="props.field"
            @change="quantityChange(e)"
            />
        </template>
        <template v-slot:Date="{ props }">
            <Date
            :data-item="props.dataItem"
            :field="props.field"
            @change="dateChange(event)"
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
                @close="courtClose"
                @open="courtOpen"
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
                @close="categoryClose"
                @open="categoryOpen"
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
                    type="submit" 
                    @click="geninv">
                Generate Invoice
            </kbutton>
        </div>
</template>
<script>
import { Grid, GridToolbar, GridNoRecords } from '@progress/kendo-vue-grid';
import { items } from '@/appdata/InvoiceItems.js';
import CommandCell from './CommandCell.vue';
import { Button } from '@progress/kendo-vue-buttons';
import { Form } from '@progress/kendo-vue-form';
import FormContent from './ClientInforForm.vue';
import { DropDownList } from '@progress/kendo-vue-dropdowns';
import { data } from '@/appdata/data.js';
import AddItemForm from './ItemDropDown.vue';
import { filterBy } from '@progress/kendo-data-query';
import Quantity from './Quantity.vue';
import Date from './Date.vue';

const delay = 500;
let courtlist = [];
let categorylist = [];
let courtValue = '';
let categoryValue = '';
let itemValue = '';

export default {
    components: {
        'Grid': Grid,
        'grid-toolbar': GridToolbar,
        'grid-norecords': GridNoRecords,
        'custom': CommandCell,
        'kbutton': Button,
        'k-form': Form,
        'formcontent': FormContent,
        dropdownlist: DropDownList,
        'dropdown': AddItemForm,
        quantity: Quantity,
        Date: Date

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
                { field: 'Date', title: 'Date', cell:'Date' , width: '200px'},
                { field: 'Item', title: 'Item', cell: 'itemDropDown'},
                { field: 'Price', title: 'Price', width: '100px' , editable: false},
                { field: 'Quantity', title: 'Quantity', width: '100px', cell: 'quantity'},
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
        dropdownChange: function (e) {
            itemValue = '';
            itemValue += e.target.value.Item;
        },
        save: function(e){
            const newList = [];
            let newItem = {};
            for(let x = 0; x < this.invItems.length; x ++){
                if(this.invItems[x].inEdit == true){
                    newItem = {
                        ID: this.invItems[x].ID,
                        inEdit: false,
                        ItemID: localStorage.getItem('itemID'),
                        Item: localStorage.getItem('itemValue'),
                        Quantity: localStorage.getItem('quantityValue'),
                        Date: localStorage.getItem('dateValue'),
                        Price: localStorage.getItem('itemPrice'),
                        Amount: localStorage.getItem('itemPrice') * localStorage.getItem('quantityValue')
                    }
                    newList.push(newItem)
                }
                else{
                    newList.push(this.invItems[x])
                }
            }
            this.invItems = [];
            this.invItems = newList;
            itemValue = '';
            localStorage.removeItem('quantityValue');
            localStorage.removeItem('dateValue');
        },
        addNewItem(){
            const dataItem = { 
                ID: this.invItems.length + 1,
                inEdit: true
            };
            this.invItems.splice(0, 0, dataItem)
        },
        geninv(){
            this.$router.push('/invoice');
        },
       edit: function(e) {
        e.dataItem.inEdit = true;
        console.log(e.dataItem.Price)
        localStorage.removeItem('itemValue');
        localStorage.removeItem('itemID');
        localStorage.removeItem('quantityValue');
        localStorage.removeItem('dateValue');
        localStorage.removeItem('itemPrice');
        localStorage.setItem('itemID', e.dataItem.ItemID);
        localStorage.setItem('quantityValue', e.dataItem.Quantity);
        localStorage.setItem('dateValue', e.dataItem.Date);
        localStorage.setItem('itemPrice', e.dataItem.Price);
        localStorage.setItem('itemValue', e.dataItem.Item);
       },
       cancel: function(e) {
        e.dataItem.inEdit = false;
       },
       loadCourtData(){
        courtlist = [];
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
        window.localStorage.removeItem('courtValue');
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
        courtValue = '';
        courtValue += court1.Court;
        window.localStorage.setItem('courtValue', courtValue);
        },
       categoryChange(event) {
        window.localStorage.removeItem('categoryValue');
        const category1 = event.value;
        this.Category = category1;
        categoryValue = '';
        categoryValue += category1.Category;
        window.localStorage.setItem('categoryValue', categoryValue);
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
       remove(e) {
            let newList = [];
            for(let x = 0; x < this.invItems.length; x ++){
                if( this.invItems[x].ID == e.dataItem.ID){
                    continue;
                }
                else{
                    if(this.invItems.length == 1){
                        newList = [];
                    }
                    else{
                        newList.push(this.invItems[x]);
                    }
                }
            }
            for(let i = 1; i < newList.length ; i++){
                newList[i].ID = newList.length - i;
            }
            if(newList.length == 0)
            {
                newList = [];
            }
            else{
                newList[0].ID = newList.length;
            }
            this.invItems = newList;
        },
    }
};

</script>
