package S11P12A708.A708.domain.user.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChangeUserRequest {

    @NotBlank
    String nickName;

    // TODO NotBlank가 맞는지 데이터를 안넣어도 넘어가야 하는 거 아닌가?
    @NotBlank
    String gitId;

    // TODO NotBlank가 맞는지 데이터를 안넣어도 넘어가야 하는 거 아닌가?
    @NotBlank
    String repo;

    // TODO NotBlank가 맞는지 데이터를 안넣어도 넘어가야 하는 거 아닌가?
    @NotBlank
    String branch;

    // TODO NotBlank가 맞는지 데이터를 안넣어도 넘어가야 하는 거 아닌가?
    @NotBlank
    String description;
}