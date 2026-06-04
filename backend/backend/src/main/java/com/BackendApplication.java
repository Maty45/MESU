package com;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

     public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
         System.out.println("\u001B[36m" +
                 "██      ██  ██████████    ████████  ██      ██  \n" +
                 "██      ██  ██████████    ████████  ██      ██  \n" +
                 "████  ████  ██          ██          ██      ██  \n" +
                 "████  ████  ██          ██          ██      ██  \n" +
                 "██  ██  ██  ████████      ██████    ██      ██  \n" +
                 "██  ██  ██  ████████      ██████    ██      ██  \n" +
                 "██      ██  ██                  ██  ██      ██  \n" +
                 "██      ██  ██                  ██  ██      ██  \n" +
                 "██      ██  ██████████  ████████      ██████    \n" +
                 "██      ██  ██████████  ████████      ██████" +
                 "\u001B[0m");
         System.out.println("\u001B[36mBACKEND CORRIENDO!\u001B[0m");
     }

}
