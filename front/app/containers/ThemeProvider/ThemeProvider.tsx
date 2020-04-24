import * as React from 'react';
import SiteProvider from 'containers/SiteProvider';

interface ThemeProviderProps {
  // id?: number;
  // url?: string;
  // children: (site: SiteFragment, refetch: any) => React.ReactNode;
}

//this obj is more for reference than anything else
const clinwikiColors = {
  //header font color

  whiteHeaderFont: '#fff',
  grayHeaderFont: '#777777',
  //darkBlue for header
  navBar: '#1b2a38',
  //button Green
  button: '#55B88D',
  //hover button
  buttonHover: '#e6e6e6',
  //hover buttonborder
  buttonBorderHover: '#adadad',
  //agg side bar gray
  sideBarBackground: '#4d5863',
  //agg side bar font colors
  sideBarColor: '#bac5d0',
  sideBarColorHover: '#fff',
  sideBarTitleFont: '#fff',
  //offwhite container for crumbs and search
  containerColor: '#f2f2f2',
  //container text is usually just black
  containerText: '#000000',
  //color of actual crumb
  crumbColor: '#55b88d',
  crumbFontColor: '#fff',
  //react-table header offgreen
  resultsTableHeader: '#8bb7a4',
  //studypage divider border color
  studyBorderColor: '#8bb7a4',
  //reactstars color
  reactStars: '#7ed964',
  //map colors
  mapMarkerBorder: '#324870',
  mapMarkerFont: '#55b88d',
  mapWarningBorder: '#ffcc00',
  mapWarningFont: '#f6a202',
  mapErrorBorder: 'red',
  mapErrorFont: 'red',
  //facility card colors
  facilityCardColor: '#55b88d',

  //panelheader in studies
  panelHeading: '#8bb7a4',
};

export const withTheme = Component => {
  class ThemeProvider extends React.Component {
    theme = site => {
      const themeString = site.themes;
      //fallback colors
      let thisTheme = {
        primaryColor: '#6BA5D6',
        secondaryColor: '#1b2a38',
        lightTextColor: '#fff',
        secondaryTextColor: '#777',
        backgroundColor: '#4D5863;',
        primaryAltColor: '#4889BF',
        sideBarColor: '#333',
        authHeaderColor: '#5786AD',
      };

      //if JSON PARSE IS SUCCESSFUL we take the theme. if not we fall back to the above object.
      if (
        /^[\],:{}\s]*$/.test(
          themeString
            .replace(/\\["\\\/bfnrtu]/g, '@')
            .replace(
              /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
              ']'
            )
            .replace(/(?:^|:|,)(?:\s*\[)+/g, '')
        )
      ) {
        thisTheme = JSON.parse(site.themes);
      }
      // console.log('this theme', theme);
      //will evnetually fill this colors with colors from SiteProvider/site and potentially use these as default or fallbacks.
      const colors = {
        //header font color
        primaryColor: thisTheme.primaryColor || '#6BA5D6',
        secondaryColor: thisTheme.secondaryColor || '#1b2a38',
        lightTextColor: thisTheme.lightTextColor || '#fff',
        secondaryTextColor: thisTheme.secondaryTextColor || '#777',
        backgroundColor: thisTheme.backgroundColor || '#4D5863',
        primaryAltColor: thisTheme.primaryAltColor || '#4889BF',
        sideBarColor: thisTheme.sideBarColor || '#333',
        authHeaderColor: thisTheme.authHeaderColor || '#5786AD',
        lightHeaderFont: '#fff',
        grayHeaderFont: '#777777',
        //darkBlue for header
        navBar: '#1b2a38',
        //button Green
        button: '#1b2a38',
        buttonHover: '#e6e6e6',
        buttonBorderHover: '#adadad',
        errorColor: 'red',
        warningColor: '#ffcc00',
        warningAltColor: '#f6a202',
        warningTertiaryColor: '#ff6d36',
      };

      //this is the master map of our theme.
      return {
        button: colors.primaryColor,
        buttonSecondary: colors.secondaryColor,
        sorterColor: colors.primaryColor,
        backgroundColor: colors.backgroundColor,

        authHeader: {
          headerBackground: colors.authHeaderColor,
          font: colors.lightTextColor,
          hoverFont: colors.secondaryTextColor,
          logoFont: '#fff',
        },
        authPage: {
          signInLinks: colors.lightTextColor,
          signInLinksHover: colors.secondaryTextColor,
        },
        authButton: {
          button: colors.primaryColor,
          buttonFont: '#fff',
          buttonHover: '#e6e6e6',
          buttonBorderHover: '#adadad',
          lightTextColor: '#fff',
        },
        aggSideBar: {
          sideBarBackground: colors.sideBarColor,
          sideBarFont: '#bac5d0',
          sideBarFontHover: '#fff',
          sideBarTitleFont: '#fff',
        },
        crumbsBar: {
          containerBackground: '#f2f2f2',
          containerFont: '#333',
          filterBarBackground: 'rgba(85, 184, 141, 0.5)',
        },
        crumbs: {
          crumbBackground: colors.primaryColor,
          crumbFont: '#fff',
        },
        presearch: {
          presearchHeaders: colors.primaryColor,
        },
        searchResults: {
          resultsHeaderBackground: colors.primaryColor,
          resultsRowHighlight: colors.primaryAltColor,
          resultsPaginationButtons: colors.primaryColor,
        },
        studyPage: {
          sectionBorderColor: colors.primaryColor,
          reviewStarColor: colors.primaryColor,
          studyPageHeader: colors.sideBarColor,
          panelHeading: colors.primaryColor,
        },
        mapSection: {
          markerFontColor: colors.primaryColor,
          markerBorderColor: colors.secondaryColor,
          facilityCardColor: colors.primaryColor,
          warningBorderColor: colors.warningColor,
          warningFontColor: colors.warningAltColor,
          errorBorderColor: colors.errorColor,
          errorFontColor: colors.errorColor,
          facilityWarningColor: colors.warningTertiaryColor,
          facilityErrorColor: colors.errorColor,
          facilityWarningPointer: colors.warningColor,
          facilityErrorPointer: colors.errorColor,
        },
      };
    };

    render() {
      return (
        <SiteProvider>
          {site => <Component theme={this.theme(site)} {...this.props} />}
        </SiteProvider>
      );
    }
  }
  return ThemeProvider;
};

export default withTheme;