package S11P12A708.A708.domain.file.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CodeFileCreateRequest {

    @NotNull
    private Long folderId;

}
