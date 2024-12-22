<template>
  <td v-if="!dataItem.inEdit">{{ dataItem[field] }}</td>
  <td v-else>
    <dropdownlist
      :text-Field="'Item'"
      :data-items="itemData"
      :filterable="true"
      :name="'Item'"
      :value="dataItem[field]"
      @filterchange="filterChange"
      @change="itemChange"
      :default-item="defaultItem"
      :loading="loading"
      v-on:open="test"
      />
  </td>
</template>

<script>
import { Button } from '@progress/kendo-vue-buttons';
import { DropDownList } from '@progress/kendo-vue-dropdowns';
import { data } from '@/appdata/data.js';
import { filterBy } from '@progress/kendo-data-query';

const delay = 500;
let itemsList = [];
export default {
  components: {
    kbutton: Button,
    dropdownlist: DropDownList,
  },
  props: {
    dataItem: Object,
    field: String,
    editor: String
  },
  data: function () {
    return {
      defaultItem: { Item: 'Select Item ...' },
      loading: false,
      itemData: data
    };
  },
  methods: {
    test(){
        const courtValue = window.localStorage.getItem('courtValue'); 
        const categoryValue = window.localStorage.getItem('categoryValue'); 
        itemsList = [];
        for (let x = 0; x < data.length; x++){
          let item= {ItemID: 0, Item: '', Price: 0};
          if(data[x].Court == courtValue && data[x].Category == categoryValue){
            if(data[x].Item == "by an attorney" || data[x].Item == "by a candidate attorney"){
                continue;
              }
              else{
                item.Item = data[x].Item;
                item.ItemID = data[x].Id
                if(data[x].Price == undefined || data[x].Price === "The tariff under rule 69 shall apply {Advocates}"){
                  for (let i = data[x].Id; i < data.length; i++){
                    if(data[i].Price == undefined || data[i].Item == "by a candidate attorney" || data[i].Price === "The tariff under rule 69 shall apply {Advocates}"){
                      continue;
                    }
                    else{
                      item.Price = data[i].Price;
                      break;
                    }
                  }
               }
               else{
                item.Price = data[x].Price;
               }
               itemsList.push(item);
              }
          }
           else{
            continue;
           }
          }
        this.itemData = itemsList;
    },
    itemChange(e) {
      localStorage.removeItem('itemID');
      localStorage.removeItem('itemPrice');
      localStorage.removeItem('itemValue');
      this.$emit('change', e, e.target.value);
      this.item = e.target.value;
      localStorage.setItem('itemID',e.target.value.ItemID);
      localStorage.setItem('itemPrice', e.target.value.Price);
      localStorage.setItem('itemValue', e.target.value.Item);
    },
    filterChange(event) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.itemData = this.filterData(event.filter);
        this.loading = false;
      }, delay);

      this.loading = true;
    },
        filterData(filter) {
            const data = itemsList.slice();
            return filterBy(data, filter);
        },
  },
};
</script>