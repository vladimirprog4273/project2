@import
Feature: Import resources

  Scenario Outline: New <resource> added (no <resource> with defined internal Id exists on floor)
    Given one building, one floor, without markers
    When new <resource> added
    Then marker <resource> added on target floor plan in top left position

    Examples:
      | resource  |
      | rooms     |
      | utilities |

  Scenario Outline: 1020
    Given multiple floors, markers with different marker types exist, some of staff and room markers have internal Ids defined
    When new <resource> added
    Then marker created on target floor in top left position

    Examples:
      | resource  |
      | rooms     |
      | utilities |

  Scenario Outline: Import empty CSV for resource "<resource>" (no existing data)
    Given initial state is empty
    When try to import empty CSV
    Then no change

    Examples:
      | resource  |
      | staff     |
      | desks     |
      | rooms     |
      | utilities |
