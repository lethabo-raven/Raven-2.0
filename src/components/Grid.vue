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
            :data-items="items"
            :loader="loader"
            :columns="columns"
            :edit-field="'inEdit'">
            <template v-slot:loader>
                <div class="k-loader-container k-loader-container-md k-loader-top">
                <div class="k-loader-container-overlay k-overlay-dark" style="background-color: lightgray;" />
                <div class="k-loader-container-inner" >
                    <Loader :size="'large'" :type="type" />
                </div>
                </div>
            </template>
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
            />
        </template>
        <template v-slot:quantity="{ props }">
            <quantity
            :data-item="props.dataItem"
            :field="props.field"
            />
        </template>
        <template v-slot:Date="{ props }">
            <Date
            :data-item="props.dataItem"
            :field="props.field"
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
import { Loader } from '@progress/kendo-vue-indicators';

const delay = 500;
let courtlist = [];
let categorylist = [];
let courtValue = '';
let categoryValue = '';
const str = localStorage.getItem('InvNo');

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
        Date: Date,
        Loader
    },
    computed:{
        hasCourt: function () {
            return this.court && this.court !== this.defaultCourt
        },
    },
    data: function () {
        return {
            loader: false,
            items: [],
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
    beforeCreate(){
        setTimeout(() => {
            this.getFunction();
        }, 1000);
    },
    updated(){
        //this.loader = false;
    },
    methods: {
        getFunction(){
            let testLst = [];
            fetch('https://raven-8f178-default-rtdb.firebaseio.com/Invoices/INVNO'+ str +'.json'
                ).then(
                    res => res.json()
                ).then( data => {
                    if(data == null || data == undefined){
                        testLst = [];
                    }
                    else{
                        const lst =  Object.entries(data);
                        for (let x = lst.length - 1; x > -1; x--){
                            testLst.push(lst[x][1]);
                        }
                    }
                    this.items = testLst;
                }
            );
            if(testLst.length > 0){
                this.loader = true;
            }
            return testLst;
         },
        save: function(e){
            let newItem = {
                ID: e.dataItem.ID,
                ItemID: localStorage.getItem('itemID'),
                Item: localStorage.getItem('itemValue'),
                Quantity: localStorage.getItem('quantityValue'),
                Date: localStorage.getItem('dateValue'),
                Price: localStorage.getItem('itemPrice'),
                Amount: localStorage.getItem('itemPrice') * localStorage.getItem('quantityValue')
            };
            this.items.splice(0, 1, newItem);
            e.dataItem.inEdit = false;
        },
        addNewItem(){
            const dataItem = { 
                ID: this.items.length + 1,
                inEdit: true
            };
            this.items.splice(0, 0, dataItem)
        },
        geninv(){
            for (let x = this.items.length - 1; x > -1 ; x--){
                const itemNo = this.items[x].ID;
                fetch('https://raven-8f178-default-rtdb.firebaseio.com/Invoices/INVNO'+ str + '/ItemNo' + itemNo +'.json',{
                    method: 'PUT',
                    headers: {
                        'Content-Type' : 'application/json'
                    },
                    body: JSON.stringify(this.items[x])
                });
            }
            this.$router.push('/invoice');
        },
       edit: function(e) {
            e.dataItem.inEdit = true;
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
            const lst = [];
            for (let item of this.items){
                if(item.ID == e.dataItem.ID){
                    continue;
                }
                else{
                    lst.push(item);
                } 
            }
            const lst2 = [];
            for(let x = 0; x < lst.length; x++){
                lst[x].ID = x + 1;
                lst2.splice(0, 0, lst[x])
            }
            this.items = lst2;
        }
    }
};

</script>
