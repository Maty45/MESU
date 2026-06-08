package com.cloudinary;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

public class CloudinaryServiceTest {

    private Cloudinary cloudinary;
    private Uploader uploader;
    private CloudinaryService cloudinaryService;

    @BeforeEach
    public void setUp() {
        cloudinary = mock(Cloudinary.class);
        uploader = mock(Uploader.class);
        when(cloudinary.uploader()).thenReturn(uploader);
        cloudinaryService = new CloudinaryService(cloudinary);
    }

    @Test
    public void testUpload() throws IOException {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.jpg",
                "image/jpeg",
                "test data".getBytes()
        );

        Map<String, Object> mockResult = new HashMap<>();
        mockResult.put("secure_url", "https://res.cloudinary.com/demo/image/upload/sample.jpg");

        when(uploader.upload(any(byte[].class), any(Map.class))).thenReturn(mockResult);

        Map<?, ?> result = cloudinaryService.upload(file);

        assertEquals("https://res.cloudinary.com/demo/image/upload/sample.jpg", result.get("secure_url"));
        verify(uploader, times(1)).upload(eq("test data".getBytes()), any(Map.class));
    }
}
