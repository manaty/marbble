package org.manaty.dictool;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

public class DictXMLHandler extends DefaultHandler{
   //Nous nous servirons de cette variable plus tard
   private String node = null;

   private Map<String,String> dic=new HashMap<String, String>();
   
   private boolean buildWordList;
   private boolean normalizeKeys;
   private String sourceWord;
   private String destWords="";
   private ArrayList<String> words;
   Pattern nonLetterPattern = Pattern.compile("[^a-z]");
   
   public DictXMLHandler(ArrayList<String> words,boolean normalizeKeys){
	   this.words=words;
	   buildWordList=(words.size()==0);
	   this.normalizeKeys=normalizeKeys;
   }
   
   public Map<String,String> getDic(){
	   return dic;
   }
   
   //début du parsing
   public void startDocument() throws SAXException {
      System.out.println("Début du parsing");
   }
   //fin du parsing
   public void endDocument() throws SAXException {
      System.out.println("Fin du parsing");
   }   
   
   /**
    * Redéfinition de la méthode pour intercepter les événements
    */
   public void startElement(String namespaceURI, String lname,
         String qname, Attributes attrs) throws SAXException {
      
    //  System.out.println("---------------------------------------------");
      //cette variable contient le nom du nœud qui a créé l'événement
      //System.out.println("qname = " + qname);
      node = qname;
         
      //Cette dernière contient la liste des attributs du nœud
      if (attrs != null) {
         for (int i = 0; i < attrs.getLength(); i++) {
            //nous récupérons le nom de l'attribut
            String aname = attrs.getLocalName(i);
            //Et nous affichons sa valeur
           // System.out.println("Attribut " + aname + " valeur : " + attrs.getValue(i));
         }
      }
   }   

   public void endElement(String uri, String localName, String qName)
         throws SAXException{
    // System.out.println("Fin de l'élément " + qName);       
   }
   
   public void characters(char[] data, int start, int end){   
	   //System.out.println("***********************************************");
	   //La variable data contient tout notre fichier.
	   //Pour récupérer la valeur, nous devons nous servir des limites en paramètre
	   //"start" correspond à l'indice où commence la valeur recherchée
	   //"end" correspond à la longueur de la chaîne
	   String str = new String(data, start, end);
	  // System.out.println("Donnée du nœud " + node + " : " + str);
	   if("orth".equals(node) && str.trim().length()>0){
		   if(sourceWord!=null){
			   boolean containsNonLetters=false;
			   if(normalizeKeys){
				   sourceWord = Normalizer.normalize(sourceWord, Normalizer.Form.NFD);
				   sourceWord = sourceWord.replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
				   sourceWord = sourceWord.replaceAll("œ","oe");
				   containsNonLetters =nonLetterPattern.matcher(sourceWord).find(); 
			   }
			   if(!containsNonLetters && !words.contains(sourceWord)){
				     System.out.println("==== "+sourceWord+" not in dic");
			   }
			   if(destWords.length()>0 && !containsNonLetters && (buildWordList || words.contains(sourceWord))){
				   dic.put(sourceWord, destWords);
				   if(sourceWord.startsWith("n")){
				     System.out.println(sourceWord+"-"+destWords);
				   }
			   }
		   }
		   sourceWord = str;
		   destWords="";
	   }
	   if("quote".equals(node) && str.trim().length()>0){
		   if(destWords.length()==0){
			   destWords+=str;
		   } 
		   //else {
		//	   destWords+=","+str;
		  // }
	   }
	}

	public static void setTransitiveTranslation(Map<String, String> dic, Map<String, String> dic2) {
	    List<String> keysToRemove = new ArrayList<>();
		for(String key : dic.keySet()){
			String sourceWord = Normalizer.normalize(dic.get(key), Normalizer.Form.NFD);
			sourceWord = sourceWord.replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
			sourceWord = sourceWord.replaceAll("œ","oe");	   
			if(dic2.containsKey(sourceWord)){
				dic.put(key, dic2.get(sourceWord));
			} else {
				keysToRemove.add(key);
			}
		}
		System.out.println("Remove "+ keysToRemove.size() +" keys from the "+dic.size()+" initially in dictionnary");
		for(String keyToRemove:keysToRemove){
			dic.remove(keyToRemove);
		}
	}
}