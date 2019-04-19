package com.fungame.aircraft.dao.cfg;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.fungame.aircraft.dao.entity.Hero;
import com.fungame.aircraft.dao.mapper.HeroMapper;

@Repository
public class HeroDao extends BaseLocalCacheDao<Integer, List<Hero>> {
	@Autowired
	HeroMapper mapper;

	@PostConstruct
	public void init() {
		this.load(1);
	}
	
	@Override
	public List<Hero> load(Integer key) {
		return this.mapper.selectAll();
	}
	
	public List<Hero> selectAll() {
		List<Hero> list = this.get(1);
		return list;
	}
	
	public Hero getFirstHeroByKind(int kind) {
		List<Hero> heroList = this.selectAll();
		Hero heroCfg = null;
		for(Hero hero: heroList) {
			if(hero.getKind() == kind) {
				if(heroCfg == null 
						|| hero.getLevel() < heroCfg.getLevel()) {
					heroCfg = hero;
				}
			}
		}
		return heroCfg;
	}
	
	public Hero getFirstHeroByAccess(int access) {
		List<Hero> heroList = this.selectAll();
		Hero heroCfg = null;
		for(Hero hero: heroList) {
			if(hero.getAccess() == access) {
				if(heroCfg == null 
						|| hero.getLevel() < heroCfg.getLevel()) {
					heroCfg = hero;
				}
			}
		}
		return heroCfg;
	}
	
	public Hero getNextHeroCfg(Hero currHero) {
		List<Hero> heroList = this.selectAll();
		Hero heroCfg = null;
		for(Hero hero: heroList) {
			if(hero.getKind() == currHero.getKind()) {
				if(heroCfg == null) {
					heroCfg = hero;
					continue;
				}
				if(hero.getLevel() > currHero.getLevel()) {
					heroCfg = hero;
					break;
				}
			}
		}
		return heroCfg;
	}
	
	public Set<Integer> getKinds() {
		Set<Integer> set = new HashSet<>();
		List<Hero> heroList = this.selectAll();
		for(Hero hero: heroList) {
			set.add(hero.getKind());
		}
		return set;
	}
	
	public Hero getHeroCfgByHeroId(int heroId, int kind) {
		List<Hero> heroList = this.selectAll();
		Hero heroCfg = null;
		for(Hero hero: heroList) {
			if(hero.getKind() == kind && hero.getId() == heroId) {
				heroCfg = hero;
				break;
			}
		}
		return heroCfg;
	}
}
