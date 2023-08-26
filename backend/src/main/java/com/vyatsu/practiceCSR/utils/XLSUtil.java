package com.vyatsu.practiceCSR.utils;

import com.vyatsu.practiceCSR.entity.api.ReportData;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.InputStreamResource;
import org.springframework.util.ResourceUtils;

import java.io.*;
import java.util.List;

public class XLSUtil {
    private static InputStream getTemplateInputStream() throws IOException {
        File file = ResourceUtils.getFile("classpath:template.xlsx");;
        return new FileInputStream(file);
    }
    public static InputStreamResource createXLSX(List<ReportData> dataList, String[] headers) throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Data");

            int rowNum = 0;
            Row headerRow = sheet.createRow(rowNum++);
            for (int i = 0; i < headers.length; i++) {
                headerRow.createCell(i).setCellValue(headers[i]);
            }
            for (ReportData data : dataList) {
                Row row = sheet.createRow(rowNum++);

                row.createCell(0).setCellValue(data.getService().getName());
                row.createCell(1).setCellValue(data.getCount1());
                row.createCell(2).setCellValue(data.getCount2());
                row.createCell(3).setCellValue(String.valueOf(data.getPercent1()));
                row.createCell(4).setCellValue(String.valueOf(data.getPercent2()));
                row.createCell(5).setCellValue(data.getRegularAct());
            }

            String outputPath = "C:/Windows/Temp/Csr/output.xlsx";  // Change this to your desired output path
            File outputFile = new File(outputPath);

            try (FileOutputStream outputStream = new FileOutputStream(outputFile)) {
                workbook.write(outputStream);
            } catch (IOException e) {
                e.printStackTrace();
            }

            return new InputStreamResource(new FileInputStream(outputFile));
        }
    }
}
