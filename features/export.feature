Feature: Export
  In order to do export
  As a user
  I want to take export data

  Scenario: 2001
    Given initial state is empty
    When just trying of exporting for templates
    Then empty CSV

  Scenario Outline: 2002
    Given multiple floors, markers with different marker types exist, some of staff and room markers have internal Ids defined
    When exporting data with <resource>
    Then CSV containing data about the markers of the selected <resource>

    Examples:
      | resource  |
      | staff     |
      | desks     |
      | utilities |
      | rooms     |
