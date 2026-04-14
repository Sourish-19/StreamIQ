import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './Landing';
import Register from './Register';
import Login from './Login';
import Dashboard from './Dashboard';
import ContentExplorer from './ContentExplorer';
import AnalyticsHub from './AnalyticsHub';
import Reports from './Reports';
import Settings from './Settings';
import GenreAnalysis from './GenreAnalysis';
import RegionalDistribution from './RegionalDistribution';
import GrowthTrends from './GrowthTrends';
import TalentInsights from './TalentInsights';
import LanguageAnalysis from './LanguageAnalysis';
import RatingAnalysis from './RatingAnalysis';
import ReleasePatterns from './ReleasePatterns';
import CustomReportBuilder from './CustomReportBuilder';

import TitleDetail from './TitleDetail';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/content" element={<ContentExplorer />} />
        <Route path="/title/:id" element={<TitleDetail />} />
        <Route path="/analytics" element={<AnalyticsHub />} />
        <Route path="/analytics/genres" element={<GenreAnalysis />} />
        <Route path="/analytics/regions" element={<RegionalDistribution />} />
        <Route path="/analytics/growth" element={<GrowthTrends />} />
        <Route path="/analytics/talent" element={<TalentInsights />} />
        <Route path="/analytics/languages" element={<LanguageAnalysis />} />
        <Route path="/analytics/ratings" element={<RatingAnalysis />} />
        <Route path="/analytics/release-patterns" element={<ReleasePatterns />} />
        <Route path="/analytics/custom" element={<CustomReportBuilder />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings/*" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}
