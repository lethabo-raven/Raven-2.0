<template>
  <div class="form-item">
    <dropdownlist
      :text-Field="'Item'"
      :data-items="itemData"
      :filterable="true"
      :name="'Item'"
      @filterchange="filterChange"
      @change="itemChange"
      :default-item="defaultItem"
      :value="item"
      :loading="loading"
      v-on:open="test"
    />
  </div>
</template>

<script>
import { Button } from '@progress/kendo-vue-buttons';
import { DropDownList } from '@progress/kendo-vue-dropdowns';
import { data } from '@/appdata/data.js';
import { filterBy } from '@progress/kendo-data-query';

const delay = 500;
let itemList = [];
export default {
  components: {
    kbutton: Button,
    dropdownlist: DropDownList,
    itemData: data
  },
  props: {
    courtValue: String,
    categoryValue: String,
    dataItem: Object,
  },
  data: function () {
    return {
      item: null,
      defaultItem: { Item: 'Select Item ...' },
      loading: false
    };
  },
  methods: {
    test(){
      console.log(this.courtValue)
    },
    itemChange(event) {
      this.item = event.value;
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
            const data = itemList.slice();
            return filterBy(data, filter);
        },
  },
};
</script>
<style scoped>
.form-item{
  padding: 5px;
}
</style>