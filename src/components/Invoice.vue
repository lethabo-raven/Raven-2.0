<template>
  <div>
        <div style="margin-bottom: 1%;">
            <btn @click="exportPDF">
                Generate Invoice
            </btn>
        </div>
        <exportPdf ref="PdfExport" margin="2cm" :paper-size="'A4'">
            <div id="gridDiv" style="max-height: 400px; overflow-y: scroll;">
                <Grid
                    ref="grid"
                    :style="{height: '330px'}"
                    :columns="columns"
                    :loader="loader"
                    :data-items="data"
                    >
                    <template v-slot:loader>
                      <div class="k-loader-container k-loader-container-md k-loader-top">
                      <div class="k-loader-container-overlay k-overlay-dark" style="background-color: lightgray;" />
                      <div class="k-loader-container-inner" >
                          <Loader :size="'large'" :type="type" />
                      </div>
                      </div>
                  </template>
                </Grid>
            </div>
        </exportPdf>
    </div>
</template>
<script>
import { PDFExport } from '@progress/kendo-vue-pdf';
import { Grid } from '@progress/kendo-vue-grid';
import { Button } from '@progress/kendo-vue-buttons';
import { Loader } from '@progress/kendo-vue-indicators';

export default {
  components: {
    Grid: Grid,
    btn: Button,
    pdfexport: PDFExport,
    Loader,
  },
  data: function () {
    return {
        loader: true,
        data: [],
        columns: [
                { field: 'ID', title: 'ID', width: '80px' },
                { field: 'Date', title: 'Date', width: '200px'},
                { field: 'Item', title: 'Item'},
                { field: 'Price', title: 'Price', width: '100px'},
                { field: 'Quantity', title: 'Quantity', width: '100px'},
                { field: 'Amount', title: 'Amount', width: '100px' }
          ],
    };
  },
  beforeCreate(){
    setTimeout(() => {
       this.getFunction();
       this.loader = false;
      }, 1000);
  },
  computed:{
      },
  methods: {
    exportPDF: function () {
      document.getElementById('gridDiv').style.height = 'auto';
      this.$refs.PdfExport.save(this.data);
    },
    getFunction(){
      const str =  'INVNO' + localStorage.getItem('InvNo');
      fetch('https://raven-8f178-default-rtdb.firebaseio.com/Invoices/'+ str +'.json',
          ).then(
              res => res.json()
          ).then( data => {
            let testLst = []
            const lst =  Object.entries(data);
            for (let x = 0; x < lst.length; x ++){
              testLst.push(lst[x][1]);
            } 
            this.data = testLst;
        }
      );
    }, 
  },
  };
</script>