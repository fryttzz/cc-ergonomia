import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Alert, Platform } from "react-native";
import { MeasureDispatchContext } from "@/context/MeasureContext";
import MeasureCard from "@/components/MeasureCard";
import { MeasureDatabase } from "@/database/useMeasureDatabase";
import { useMeasureDatabase } from "@/database/useMeasureDatabase";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import PdfIcon from "../../assets/pdf.svg"

export default function ListMeasure() {
  const [measures, setMeasures] = useState<MeasureDatabase[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const setMeasureDetails = useContext(MeasureDispatchContext);

  const { getMeasures } = useMeasureDatabase();

  async function handleGetMeasures() {
    try {
      const response = await getMeasures();
      setMeasures(response);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDetails(measureId: string) {
    setMeasureDetails(measureId);
    router.navigate(`/`);
  }

  const generatePDFHTML = (measures: MeasureDatabase[]): string => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('pt-BR');
    const formattedTime = currentDate.toLocaleTimeString('pt-BR');
    
    const measureRows = measures.map((measure, index) => `
      <tr style="${index % 2 === 0 ? 'background-color: #f9f9f9;' : ''}">
        <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: center;">${measure.sugarLevel} mg/dL</td>
        <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: center;">${measure.date}</td>
        <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: center;">${measure.time}</td>
        <td style="padding: 12px; border-bottom: 1px solid #ddd;">${measure.description || 'Sem descrição'}</td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Medições de Índice Glicêmico</title>
          <style>
            @page {
              margin: 2cm;
              @bottom-center {
                content: "Página " counter(page) " - Exportado em ${formattedDate} às ${formattedTime}";
                font-size: 10px;
                color: #666;
              }
            }
            
            body {
              font-family: 'Arial', sans-serif;
              margin: 0;
              padding: 0;
              line-height: 1.6;
              color: #333;
            }
            
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 3px solid #2196F3;
              padding-bottom: 20px;
            }
            
            .header h1 {
              color: #2196F3;
              margin: 0;
              font-size: 28px;
              font-weight: bold;
            }
            
            .subtitle {
              color: #666;
              margin: 10px 0 0 0;
              font-size: 14px;
            }
            
            .summary {
              background-color: #f5f5f5;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 30px;
              border-left: 4px solid #2196F3;
            }
            
            .summary h3 {
              margin: 0 0 15px 0;
              color: #2196F3;
              font-size: 18px;
            }
            
            .summary-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 15px;
            }
            
            .summary-item {
              background: white;
              padding: 15px;
              border-radius: 6px;
              text-align: center;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            .summary-value {
              font-size: 24px;
              font-weight: bold;
              color: #2196F3;
              display: block;
            }
            
            .summary-label {
              font-size: 12px;
              color: #666;
              margin-top: 5px;
            }
            
            .table-container {
              margin-top: 20px;
            }
            
            .table-title {
              color: #2196F3;
              font-size: 20px;
              margin-bottom: 15px;
              font-weight: bold;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              background: white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              border-radius: 8px;
              overflow: hidden;
            }
            
            th {
              background-color: #2196F3;
              color: white;
              padding: 15px 12px;
              text-align: center;
              font-weight: bold;
              font-size: 14px;
            }
            
            td {
              font-size: 13px;
              vertical-align: top;
            }
            
            .no-data {
              text-align: center;
              padding: 40px;
              color: #666;
              font-style: italic;
            }
            
            .footer-info {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Medições de Índice Glicêmico</h1>
            <p class="subtitle">Relatório completo das medições registradas</p>
          </div>
          
          ${measures.length > 0 ? `
            <div class="summary">
              <h3>Resumo das Medições</h3>
              <div class="summary-grid">
                <div class="summary-item">
                  <span class="summary-value">${measures.length}</span>
                  <div class="summary-label">Total de Medições</div>
                </div>
                <div class="summary-item">
                  <span class="summary-value">${Math.round(measures.reduce((acc, m) => acc + parseFloat(m.sugarLevel), 0) / measures.length)}</span>
                  <div class="summary-label">Média (mg/dL)</div>
                </div>
                <div class="summary-item">
                  <span class="summary-value">${Math.max(...measures.map(m => parseFloat(m.sugarLevel)))}</span>
                  <div class="summary-label">Maior Valor (mg/dL)</div>
                </div>
                <div class="summary-item">
                  <span class="summary-value">${Math.min(...measures.map(m => parseFloat(m.sugarLevel)))}</span>
                  <div class="summary-label">Menor Valor (mg/dL)</div>
                </div>
              </div>
            </div>
            
            <div class="table-container">
              <div class="table-title">Detalhamento das Medições</div>
              <table>
                <thead>
                  <tr>
                    <th>Glicemia (mg/dL)</th>
                    <th>Data</th>
                    <th>Horário</th>
                    <th>Descrição</th>
                  </tr>
                </thead>
                <tbody>
                  ${measureRows}
                </tbody>
              </table>
            </div>
          ` : `
            <div class="no-data">
              <h3>Nenhuma medição encontrada</h3>
              <p>Não há medições registradas para exportar.</p>
            </div>
          `}
          
          <div class="footer-info">
            <p><strong>Relatório gerado em:</strong> ${formattedDate} às ${formattedTime}</p>
          </div>
        </body>
      </html>
    `;
  };

  const handleExportToPDF = async () => {
    if (measures.length === 0) {
      Alert.alert("Aviso", "Não há medições para exportar.");
      return;
    }

    setIsExporting(true);
    
    try {
      const htmlContent = generatePDFHTML(measures);
      
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      const currentDate = new Date();
      const fileName = `medicoes_glicemia_${currentDate.getFullYear()}${(currentDate.getMonth() + 1).toString().padStart(2, '0')}${currentDate.getDate().toString().padStart(2, '0')}_${currentDate.getHours().toString().padStart(2, '0')}${currentDate.getMinutes().toString().padStart(2, '0')}.pdf`;
      
      const documentsDirectory = FileSystem.documentDirectory;
      const newUri = documentsDirectory + fileName;
      
      await FileSystem.moveAsync({
        from: uri,
        to: newUri,
      });

      const isAvailable = await Sharing.isAvailableAsync();
      
      if (isAvailable) {
        await Sharing.shareAsync(newUri, {
          UTI: 'com.adobe.pdf',
          mimeType: 'application/pdf',
        });
      } else {
        Alert.alert(
          "PDF Gerado", 
          `O arquivo foi salvo como: ${fileName}\nLocalização: ${newUri}`,
          [{ text: "OK" }]
        );
      }

    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      Alert.alert("Erro", "Não foi possível gerar o PDF. Tente novamente.");
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    handleGetMeasures();
  });

  return (
    <SafeAreaView style={styles.container}>
      {measures.length > 0 ? (
        measures.map((item) => (
          <MeasureCard
            key={item.id}
            itemId={item.id}
            sugarLevel={item.sugarLevel}
            date={item.date}
            description={item.description}
            time={item.time}
            onPress={() => handleDetails(String(item.id))}
          />
        ))
      ) : (
        <Text style={styles.emptyList}>Sem medições cadastradas!</Text>
      )}
      <TouchableOpacity
        style={[
          styles.pdfButton,
          { opacity: isExporting ? 0.6 : 1 }
        ]}
        onPress={handleExportToPDF}
        disabled={isExporting}
        activeOpacity={0.8}
      >
        <PdfIcon width={35} height={35} fill="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  list: {},
  listHeader: {},
  emptyList: { 
    color: Colors.dark.HighlightFix, 
    alignSelf: "center",
    marginTop: 50,
    fontSize: 16,
  },
  pdfButton: {
    position: 'relative',
    backgroundColor: '#FF4444',
    left: "86%",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 1000,
  },
});
