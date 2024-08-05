package S11P12A708.A708.domain.file.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FileUpdateRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String content;

}
