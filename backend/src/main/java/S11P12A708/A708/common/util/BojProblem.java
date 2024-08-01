package S11P12A708.A708.common.util;

import S11P12A708.A708.domain.problem.entity.SiteInfoType;

public class BojProblem {
    private SiteInfoType siteInfo;
    private int number;
    private String name;
    private String level;

    // 기본 생성자
    public BojProblem() {
    }

    // 매개변수가 있는 생성자
    public BojProblem(SiteInfoType siteInfo, int number, String name, String level) {
        this.siteInfo = siteInfo;
        this.number = number;
        this.name = name;
        this.level = level;
    }

    // Getter 및 Setter 메서드
    public SiteInfoType getSiteInfo() {
        return siteInfo;
    }

    public void setSiteInfo(SiteInfoType siteInfo) {
        this.siteInfo = siteInfo;
    }

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    // toString 메서드
    @Override
    public String toString() {
        return "Problem{" +
                "siteInfo='" + siteInfo + '\'' +
                ", number=" + number +
                ", name='" + name + '\'' +
                ", level=" + level +
                '}';
    }
}
