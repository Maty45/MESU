package com.publicacioninsumoimagen;

import com.cloudinary.CloudinaryService;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class PublicacionInsumoImagenControllerTest {

    @Test
    public void testUploadImageSuccess() throws IOException {
        CloudinaryService service = mock(CloudinaryService.class);
        PublicacionInsumoImagenController controller = new PublicacionInsumoImagenController(service);

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.jpg",
                "image/jpeg",
                "test data".getBytes()
        );

        Map<String, Object> mockResult = new HashMap<>();
        mockResult.put("secure_url", "https://res.cloudinary.com/demo/image/upload/sample.jpg");

        when(service.upload(file)).thenReturn(mockResult);

        ResponseEntity<Map<String, String>> response = controller.uploadImage(file);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("https://res.cloudinary.com/demo/image/upload/sample.jpg", response.getBody().get("url"));
    }
}
