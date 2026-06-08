package com.cloudinary;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import java.util.Map;

public class CloudinaryTest {
    public static void main(String[] args) {
        try {
            // 1. Configure Cloudinary
            Cloudinary cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "dwyzkdftc",
                "api_key", "848553669342279",
                "api_secret", "gEzne7qsLTejXnZwhRBXft9TacU",
                "secure", true
            ));

            System.out.println("Cloudinary configured successfully.");

            // 2. Upload an image
            String imageUrl = "https://res.cloudinary.com/demo/image/upload/sample.jpg";
            System.out.println("Uploading sample image: " + imageUrl);
            Map uploadResult = cloudinary.uploader().upload(imageUrl, ObjectUtils.emptyMap());

            String secureUrl = (String) uploadResult.get("secure_url");
            String publicId = (String) uploadResult.get("public_id");

            System.out.println("Upload successful!");
            System.out.println("Secure URL: " + secureUrl);
            System.out.println("Public ID: " + publicId);

            // 3. Get image details
            Object width = uploadResult.get("width");
            Object height = uploadResult.get("height");
            Object format = uploadResult.get("format");
            Object bytes = uploadResult.get("bytes");

            System.out.println("Image Details:");
            System.out.println("Width: " + width + " px");
            System.out.println("Height: " + height + " px");
            System.out.println("Format: " + format);
            System.out.println("File size: " + bytes + " bytes");

            // 4. Transform the image
            String transformedUrl = cloudinary.url()
                .transformation(new com.cloudinary.Transformation()
                    .fetchFormat("auto")
                    .quality("auto"))
                .generate(publicId);

            System.out.println("Done! Click link below to see optimized version of the image. Check the size and the format.");
            System.out.println(transformedUrl);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
