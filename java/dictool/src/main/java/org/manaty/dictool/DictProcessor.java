package org.manaty.dictool;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Map;
import java.util.Scanner;
import java.util.zip.ZipFile;

import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;

public class DictProcessor {

	static DictXMLHandler getHandler(String originLang, String destinationLang,boolean normalizeKeys) {
		DictXMLHandler handler = null;
		String dicName = "../../dicts/" + originLang + "-" + destinationLang + ".zip";
		String wordsName = "../../dicts/" + originLang + "_words.zip";
		InputStream dicStream = null, wordStream = null;
		ZipFile zipFile = null;
		try {
			ArrayList<String> words = new ArrayList<>();
			if(Files.exists(Paths.get(wordsName))){
				if (wordsName.endsWith(".zip")) {
					zipFile = new ZipFile(wordsName);
					wordStream = zipFile.getInputStream(zipFile.entries().nextElement());
				} else {
					wordStream = new FileInputStream(wordsName);
				}
				Scanner sc = new Scanner(wordStream);
				sc.useDelimiter(",");
				while (sc.hasNext()) {
					words.add(sc.next());
				}
				System.out.println("read " + words.size() + " words from " + wordsName);
			}			
			if (dicName.endsWith(".zip")) {
				zipFile = new ZipFile(dicName);
				dicStream = zipFile.getInputStream(zipFile.entries().nextElement());
			} else {
				dicStream = new FileInputStream(dicName);
			}
			SAXParserFactory factory = SAXParserFactory.newInstance();
			SAXParser parser = factory.newSAXParser();
			handler = new DictXMLHandler(words,normalizeKeys);
			parser.parse(dicStream, handler);
			if(!Files.exists(Paths.get(wordsName))){
				wordsName = "../../dicts/" + originLang + "_words.txt";
				Files.write(Paths.get(wordsName), () -> words.stream()
						.<CharSequence>map(e -> "\"" + e + "\":1,").iterator());				
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (dicStream != null) {
				try {
					dicStream.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
			if (zipFile != null) {
				try {
					zipFile.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		return handler;

	}

	public static void main(String[] args) {
		DictXMLHandler handler = getHandler("fra", "eng",true);
		Map<String,String> dic = handler.getDic();
		DictXMLHandler handler2 = getHandler("eng", "spa",false);
		Map<String,String> dic2 = handler2.getDic();
		DictXMLHandler.setTransitiveTranslation(dic,dic2);
		String outputDicName = "../../dicts/fr_es.txt";
		try {
			Files.write(Paths.get(outputDicName), () -> dic.entrySet().stream()
					.<CharSequence>map(e -> "\"" + e.getKey() + "\":\"" + e.getValue() + "\",").iterator());
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
