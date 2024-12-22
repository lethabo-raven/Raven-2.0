<template>
    <td v-if="!dataItem.inEdit">{{ dataItem[field] }}
    </td>
    <td v-else>
        <NumericTextBox
          :style="{ width: '80px' }"
          :value="dataItem[field]"
          @change="change"
          :default-value="defaultValue"
        >
        </NumericTextBox>
    </td>
</template>
<script>
import { NumericTextBox } from '@progress/kendo-vue-inputs';
export default {
  components: {
    NumericTextBox,
  },
  props: {
    dataItem: Object,
    field: String
  },
  data: function () {
    return {
      defaultValue: 1,
    };
  },
  methods: {
    change(e){
        localStorage.removeItem('quantityValue');
        localStorage.setItem('quantityValue',e.target.value)
    }
  },
};
</script>