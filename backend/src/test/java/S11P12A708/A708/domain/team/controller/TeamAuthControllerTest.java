package S11P12A708.A708.domain.team.controller;

import S11P12A708.A708.domain.team.service.TeamAuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(TeamAuthController.class)
class TeamAuthControllerTest {

    @MockBean
    private TeamAuthService teamAuthService;

    @Autowired
    private MockMvc mockMvc;

    @Nested
    @DisplayName("그룹목록")
    class TeamList {

        @Test
        @DisplayName("그룹목록을_읽어온다")
        void readTeamList() {
            // given & when
        }

        @Test
        @DisplayName("로그인된_유저와_요청한_유저정보가_다르면_예외를_던진다")
        void checkLoginUser() {

        }

    }

    @Nested
    @DisplayName("그룹생성")
    class TeamCreation {

        @Test
        @DisplayName("새로운_그룹을_생성한다")
        void createNewTeam() {

        }

        @Test
        @DisplayName("로그인된_유저와_요청한_유저정보가_다르면_예외를_던진다")
        void checkLoginUser(){

        }

    }

    @Nested
    @DisplayName("팀코드")
    class TeamCode {

        @Test
        @DisplayName("팀코드가_없다면_새로생성해서_저장후에_반환한다")
        void createTeamCode() {

        }

        @Test
        @DisplayName("팀코드가_존재하면_기존_코드를_반환한다")
        void getTeamCode() {

        }

    }

}